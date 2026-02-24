import logging

from app.api.course.schema import TaskStudentFlat
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import ORJSONResponse
from pydantic import UUID4

from app.api.user.dependencies import UserServiceDep
from app.api.user.schema import LecturerCreate, LecturerCreateReq, LecturerDashboardSummary, LecturerDetailsOut, StudentCreate, StudentCreateReq, StudentDashboardSummary, StudentDetailsOut, UserCreate, UserDetailedOut, UserOut



logger = logging.getLogger(__name__)

user_router = APIRouter(prefix="/user", tags=["User"])


# @user_router.post(
#     "", status_code=status.HTTP_201_CREATED, summary="Create a new user"
# )
# async def create_user(
#     user_data: UserCreate,
#     user_service: UserServiceDep
# ) -> UserOut:
#     res = await user_service.create_user(user_data)
#     return res
#

# ==============================================================================
# Student
# ==============================================================================
@user_router.post(
    "/student",
    status_code=status.HTTP_201_CREATED, summary="Create a new student",
    tags=["Student"]
)
async def create_student(
    user_data: StudentCreateReq,
    user_service: UserServiceDep
) -> UserOut:
    student_data = StudentCreate(**user_data.dict(exclude_unset=True))
    res = await user_service.create_student(student_data)
    return res

@user_router.get(
    "/students",
    tags=["Lecturer", "HOD"]
)
async def get_students(
    user_service: UserServiceDep,
    department_id: UUID4 | None = None,
    session_id: UUID4 | None = None,
    admission_session_id: UUID4 | None = None,
    course_offering_id: UUID4 | None = None,
    skip: int | None = None,
    limit: int | None = None,
) -> list[StudentDetailsOut]:
    return await user_service.get_students(
        department_id, session_id, admission_session_id,
        course_offering_id, skip, limit
    )

# ==============================================================================
# Lecturer
# ==============================================================================
@user_router.post(
    "/lecturer",
    status_code=status.HTTP_201_CREATED, summary="Create a new lecturer",
    tags=["Lecturer"]
)
async def create_lecturer(
    user_data: LecturerCreateReq,
    user_service: UserServiceDep
) -> UserOut:
    lecturer_data = LecturerCreate(**user_data.dict(exclude_unset=True))
    res = await user_service.create_lecturer(lecturer_data)
    return res

@user_router.get(
    "/lecturer",
    tags=["HOD"]
)
async def get_lecturers(
    user_service: UserServiceDep,
    department_id: UUID4 | None = None,
    session_id: UUID4 | None = None,
    course_offering_id: UUID4 | None = None,
    skip: int | None = None,
    limit: int | None = None,
) -> list[LecturerDetailsOut]:
    return await user_service.get_lecturers(
        department_id, session_id, course_offering_id, skip, limit
    )

@user_router.get(
    "/lecturer/dashboard/summary",
    tags=["Lecturer"]
)
async def get_lecturer_dashboard_summary(
    user_service: UserServiceDep,
    lecturer_id: UUID4,
) -> LecturerDashboardSummary:
    return await user_service.get_lecturer_dashboard_summary(lecturer_id)


@user_router.get(
    "/student/dashboard/summary",
    tags=["Student"]
)
async def get_lecturer_dashboard_summary(
    user_service: UserServiceDep,
    student_id: UUID4,
) -> StudentDashboardSummary:
    return await user_service.get_student_dashboard_summary(student_id)


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
) -> UserDetailedOut:
    user = await user_service.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user
