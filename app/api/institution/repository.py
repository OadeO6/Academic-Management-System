from pydantic import UUID4
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.common.repo import PAGE_SIZE, BaseRepo, PaginatedResult
from app.api.institution.models import Department, Faculty, School, Semester, Session
from app.api.institution.schema import DepartmentCreate, DepartmentUpdate, FacultyCreate, FacultyUpdate, SchoolCreate, SchoolUpdate, SemesterCreate, SemesterUpdate, SessionCreate, SessionUpdate


class SchoolRepo(BaseRepo[School, SchoolCreate, SchoolUpdate]):
    pass


class SessionRepo(BaseRepo[Session, SessionCreate, SessionUpdate]):
    async def get_session_id_by_semester(
        self, con: AsyncSession, semester_id: UUID4
    ) -> UUID4 | None:
        query = (
            select(self.model.id)
            .select_from(Semester)
            .join(
                Session,
                Semester.session_id == Session.id
            )
            .where(
                Semester.id == semester_id
            )
        )
        result = await con.execute(query)
        return result.scalar_one_or_none()


class SemesterRepo(BaseRepo[Semester, SemesterCreate, SemesterUpdate]):
    pass

class FacultyRepo(BaseRepo[Faculty, FacultyCreate, FacultyUpdate]):
    async def get_faculties(
            self, con: AsyncSession, school_id: UUID4 | None = None
    ) -> list[Faculty]:
        if school_id is None:
            faculties = await self.get_all(con)
        else:
            faculties = await self.get_all(
                con, filter={self.model.school_id: school_id}
            )
        return faculties


class DepartmentRepo(BaseRepo[Department, DepartmentCreate, DepartmentUpdate]):
    async def _get_departments(
        self, con: AsyncSession, faculty_id: UUID4 | None = None,
        school_id: UUID4 | None = None,
        skip: int | None = None,
        limit: int | None = None
    ) -> list[Department]:
        query = (
            select(self.model)
            .select_from(Department)
            .join(
                Faculty,
                Department.faculty_id == Faculty.id
            )
        )

        if faculty_id is not None:
            query = query.where(
                Faculty.id == faculty_id
            )
        if school_id is not None:
            query = query.where(
                School.id == school_id
            )
        if skip is not None:
            query = query.offset(skip)
        if limit is not None:
            query = query.limit(limit)

        return query

    async def get_departments(
        self, con: AsyncSession,
        faculty_id: UUID4 | None = None,
        school_id: UUID4 | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[Department]:
        query = self._get_departments(con, faculty_id, school_id, skip, limit)
        departments = await con.execute(query)
        return departments.scalars().all()

    async def get_departments_paginated(
        self, con: AsyncSession,
        faculty_id: UUID4 | None = None,
        school_id: UUID4 | None = None,
        skip: int | None = None, limit: int = PAGE_SIZE
    ) -> PaginatedResult[Department]:
        query = self._get_departments(con, faculty_id, school_id, skip, limit)
        count_query = query.with_only_columns(func.count()).order_by(None).limit(None).offset(None)
        total = await con.scalar(count_query)
        items = await self.get_departments(con, faculty_id, school_id, skip, limit)

        return PaginatedResult[Department](
            page_number=(skip // limit + 1 if skip is not None else 1) if total is not None else 0,
            page_size=limit if limit is not None else 0,
            total_items=total if total is not None else 0,
            items=items,
            total_pages=total // limit + 1 if total is not None else 0,
        )


