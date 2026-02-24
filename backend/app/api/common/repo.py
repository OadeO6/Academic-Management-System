from typing import Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict
from sqlalchemy import func, inspect, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload


from .models import Base


ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

PAGE_SIZE = 45


class PaginatedResult(BaseModel, Generic[ModelType]):
    model_config = ConfigDict(arbitrary_types_allowed = True)

    page_number: int
    page_size: int
    total_items: int
    total_pages: int
    items: list[ModelType]


class BaseRepo(
    Generic[ModelType, CreateSchemaType, UpdateSchemaType]
):
    def __init__(self, model: type[ModelType]):
        self.model = model


    def build_selectin_options(
        self, depth: int, model=None, visited=None
    ):
        """
        Build a list of selectin options for eager loading.
        This is a recursive function that builds a list of selectin options
        """
        if depth <= 0:
            return []

        model = model or self.model
        visited = visited or set()

        if model in visited:
            return []

        visited.add(model)
        mapper = inspect(model)
        options = []

        for rel in mapper.relationships:
            # Skip backrefs that point to already visited models in this path
            # This is the key fix
            target_model = rel.mapper.class_
            # if target_model in visited and rel.direction.name == "MANYTOONE":
            #     # It's a backref to a parent already in the load chain → skip eager load
            #     # because the instance is already attached
            #     continue

            attr = getattr(model, rel.key)
            loader = selectinload(attr)

            if depth > 1:
                nested_options = self.build_selectin_options(
                    depth - 1,
                    target_model,
                    visited.copy()
                )
                for nested in nested_options:
                    loader = loader.options(nested)

            options.append(loader)

        return options


    async def get_all(
        self, con: AsyncSession, filter: dict | None = None, depth: int = 0,
        skip: int | None = None, limit: int | None = None
    ) -> list[ModelType]:
        options = self.build_selectin_options(depth)
        query = select(self.model).options(*options)

        if filter:
            filter_clauses = [key == value for key, value in filter.items()]
            query = query.where(*filter_clauses)


        if skip is not None:
            query = query.offset(skip)

        if limit is not None:
            query = query.limit(limit)

        result = await con.execute(query)
        return result.scalars().all()

    async def get_all_paginated(
        self, con: AsyncSession, filter: dict | None = None, depth: int = 0,
        skip: int | None = None, limit: int  = PAGE_SIZE
    ) -> PaginatedResult:
        options = self.build_selectin_options(depth)
        query = select(self.model.id).options(*options).limit(None).offset(None)

        if filter:
            filter_clauses = [key == value for key, value in filter.items()]
            query = query.where(*filter_clauses)
        count_query = query.with_only_columns(func.count()).order_by(None)
        total = await con.scalar(count_query)
        items = await self.get_all(con, filter, depth)

        return PaginatedResult[ModelType](
            page_number=(skip // limit + 1 if skip is not None else 1) if total is not None else 0,
            page_size=limit if limit is not None else 0,
            total_items=total if total is not None else 0,
            items=items,
            total_pages=total // limit + 1 if total is not None else 0,
        )


    async def get_by_id(
        self, con: AsyncSession, id: UUID, skip: int | None = None,
        limit: int | None = None, depth: int = 0
    ) -> list[ModelType]:
        options = self.build_selectin_options(depth)
        query = select(self.model.id, self.model).where(self.model.id == id).options(*options)

        if skip is not None:
            query = query.offset(skip)

        if limit is not None:
            query = query.limit(limit)

        result = await con.execute(query)
        return result.scalars().all()

    async def get_by_id_paginated(
        self, con: AsyncSession, id: UUID, depth: int = 0,
        skip: int | None = None, limit: int = PAGE_SIZE
    ) -> PaginatedResult[ModelType]:
        options = self.build_selectin_options(depth)
        query = select(self.model.id).where(self.model.id == id).options(*options).limit(None).offset(None)
        count_query = query.with_only_columns(func.count()).order_by(None)
        total = await con.scalar(count_query)
        items = await self.get_by_id(con, id, depth)

        return PaginatedResult[ModelType](
            page_number=(skip // limit + 1 if skip is not None else 1) if total is not None else 0,
            page_size=limit if limit is not None else 0,
            total_items=total if total is not None else 0,
            items=items,
            total_pages=total // limit + 1 if total is not None else 0,
        )

    async def get_one_by_id(
        self, con: AsyncSession, id: UUID, depth: int = 0
    ) -> ModelType | None:
        # rels = inspect(self.model).relationships

        options = self.build_selectin_options(depth)
        query = (
            select(self.model)
            .where(
                self.model.id == id
            )
            .options(
                *options
            )
        )
        result = await con.execute(query)
        return result.scalar_one_or_none()

    async def create_one(self, con: AsyncSession, create_obj: CreateSchemaType) -> ModelType:
        print(create_obj, type(self.model))
        obj = self.model(**create_obj.model_dump())
        con.add(obj)
        await con.flush()
        await con.refresh(obj)
        return obj

    async def create_multiple(
        self, con: AsyncSession, mul_create_obj: list[CreateSchemaType]
    ) -> list[ModelType]:
        objs = [self.model(**obj.model_dump()) for obj in mul_create_obj]
        con.add_all(objs)
        await con.flush()
        for obj in objs:
            await con.refresh(obj)
        return objs

    async def update(self, con: AsyncSession, id: UUID, update_obj: UpdateSchemaType) -> ModelType | None:
        # Fetch existing record
        db_obj = await self.get_one_by_id(con, id)
        if not db_obj:
            return None

        update_data = update_obj.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)

        con.add(db_obj)
        await con.flush()
        await con.refresh(db_obj)
        return db_obj

    async def delete(self, con: AsyncSession, id: UUID) -> bool:
        obj = await self.get_one_by_id(con, id)
        if not obj:
            return False

        await con.delete(obj)
        await con.flush()
        return True
