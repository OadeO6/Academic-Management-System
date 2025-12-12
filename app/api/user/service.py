from typing import Annotated
from uuid import UUID

from app.api.user.dependencies import get_user_repo
from fastapi import Depends

from app.api.common.dependencies import DbCon
from app.api.user.models import User
from app.api.user.repository import UserRepo
from app.api.user.schema import LecturerCreate, StudentCreate, UserCreate


class UserService:
    def __init__(
        self,
        session: DbCon,
        # user_repo: UserRepo
        user_repo: Annotated[UserRepo, Depends(get_user_repo)]
    ):
        self.user_repo = user_repo
        self.session = session

    async def create_user(self, user_data: UserCreate) -> User:
        async with self.session.begin():
            user = await self.user_repo.create_user(self.session, user_data)
            return user

    async def create_student(self, user_data: StudentCreate) -> User:
        async with self.session.begin():
            user = await self.user_repo.create_user(self.session, user_data)
            return user

    async def create_lecturer(self, user_data: LecturerCreate) -> User:
        async with self.session.begin():
            user = await self.user_repo.create_user(self.session, user_data)
            return user

    async def attach_lecturer_profile(self, user_id: UUID):
        pass

    async def get_users(
        self, skip: int | None = None, limit: int | None = None
    ) -> list[User]:
        async with self.session.begin():
            users = await self.user_repo.get_users(self.session, skip, limit)
            return users

    async def get_user(
        self, id: UUID
    ) -> User | None:
        async with self.session.begin():
            user = await self.user_repo.get_one_by_id(self.session, id)
            return user
