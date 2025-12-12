from sqlalchemy.ext.asyncio import AsyncSession
from app.api.common.repo import BaseRepo
from app.api.user.models import User
from app.api.user.schema import UserCreate, UserUpdate


class UserRepo(BaseRepo[User, UserCreate, UserUpdate]):
    async def create_user(
        self, con: AsyncSession, user_obj: UserCreate
    ) -> User:
        user = await self.create_one(con, create_obj=user_obj)
        return user

    async def get_users(
        self, con: AsyncSession,
        skip: int | None = None, limit: int | None = None
    ) -> list[User]:
        users = await self.get_all(con, skip, limit)
        return users

    async def get_user(
        self, con: AsyncSession,
        skip: int | None = None, limit: int | None = None
    ) -> User:
        users = await self.get_all(con, skip, limit)
        return users
