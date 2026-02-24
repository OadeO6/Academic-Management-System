from typing import Annotated

from app.api.user.models import LecturerProfile, StudentProfile, User
from app.api.user.repository import LecturerProfileRepo, StudentProfileRepo, UserRepo
from fastapi import Depends



async def get_user_repo():
    user_repo = UserRepo(User)
    return user_repo

async def get_lecturer_profile_repo():
    lecturer_profile_repo = LecturerProfileRepo(LecturerProfile)
    return lecturer_profile_repo

async def get_student_profile_repo():
    student_profile_repo = StudentProfileRepo(StudentProfile)
    return student_profile_repo


from app.api.user.service import UserService



UserServiceDep = Annotated[UserService, Depends()]
