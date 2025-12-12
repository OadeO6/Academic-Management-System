from typing import Union, cast, overload
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.common.repo import BaseRepo
from app.api.user.models import LecturerProfile, StudentProfile, User
from app.api.user.schema import LecturerCreate, StudentCreate, UserCreate, UserType, UserUpdate


class UserRepo(BaseRepo[User, UserCreate, UserUpdate]):
    async def create_user(
        self, con: AsyncSession,
        user_obj: UserCreate | StudentCreate | LecturerCreate
    ) -> User:
        user = User(
            first_name=user_obj.first_name,
            last_name=user_obj.last_name,
            email=user_obj.email,
            password=user_obj.password,
            user_type=user_obj.user_type,
            department_id=user_obj.department_id,
        )

        con.add(user)
        await con.flush()

        if user.user_type == UserType.STUDENT:
            user_obj = cast(StudentCreate, user_obj)
            profile = StudentProfile(
                user_id=user.id,
                matric_number=user_obj.matric_number,
                year_of_admission=user_obj.year_of_admission,
                admission_session=user_obj.admission_session,
                status=user_obj.status,
            )
            con.add(profile)
            await con.flush()
            await con.refresh(user)

        elif user.user_type == UserType.LECTURER:
            user_obj = cast(LecturerCreate, user_obj)
            profile = LecturerProfile(
                user_id=user.id,
                rank=user_obj.rank,
                title=user_obj.title,
                degree=user_obj.degree,
                status=user_obj.status,
            )
            con.add(profile)
            await con.flush()
            await con.refresh(user)

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
