import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import ORJSONResponse
from pydantic import UUID4

from app.api.user.dependencies import UserServiceDep
from app.api.user.schema import LecturerCreate, StudentCreate, UserCreate, UserOut



logger = logging.getLogger(__name__)

user_router = APIRouter(prefix="/user", tags=["User"])


@user_router.post(
    "", status_code=status.HTTP_201_CREATED, summary="Create a new user"
)
async def create_user(
    user_data: UserCreate,
    user_service: UserServiceDep
) -> UserOut:
    res = await user_service.create_user(user_data)
    return res


@user_router.post(
    "/student",
    status_code=status.HTTP_201_CREATED, summary="Create a new student"
)
async def create_student(
    user_data: StudentCreate,
    user_service: UserServiceDep
) -> UserOut:
    res = await user_service.create_student(user_data)
    return res


@user_router.post(
    "/lecturer",
    status_code=status.HTTP_201_CREATED, summary="Create a new lecturer"
)
async def create_lecturer(
    user_data: LecturerCreate,
    user_service: UserServiceDep
) -> UserOut:
    res = await user_service.create_lecturer(user_data)
    return res


@user_router.get("/users")
async def get_users(
        user_service: UserServiceDep
) -> list[UserOut]:
    users = await user_service.get_users()
    return users

@user_router.get("/users/{user_id}")
async def get_user(
    user_id: UUID4,
    user_service: UserServiceDep,
) -> UserOut:
    user = await user_service.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user
