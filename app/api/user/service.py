from typing import Annotated
from uuid import UUID

from app.api.course.dependencies import CourseServiceDep
from app.api.course.models import Message
from app.api.course.schema import TaskStudentFlat, TaskStudentStatus, TaskType
from app.api.user.dependencies import get_lecturer_profile_repo, get_student_profile_repo, get_user_repo
from fastapi import Depends

from app.api.common.dependencies import DbCon
from app.api.user.models import User
from app.api.user.repository import LecturerProfileRepo, StudentProfileRepo, UserRepo
from app.api.user.schema import LecturerCreate, LecturerDashboardSummary, LecturerDetailsOut, StudentCreate, StudentDashboardSummary, StudentDetailsOut, UserCreate


class UserService:
    def __init__(
        self,
        session: DbCon,
        # user_repo: UserRepo
        user_repo: Annotated[UserRepo, Depends(get_user_repo)],
        course_service: CourseServiceDep,
        message_service: CourseServiceDep,
        task_service: CourseServiceDep,
        student_repo: Annotated[
            StudentProfileRepo, Depends(get_student_profile_repo)
        ],
        lecturer_repo: Annotated[
            LecturerProfileRepo, Depends(get_lecturer_profile_repo)
        ],
    ):
        self.user_repo = user_repo
        self.course_service = course_service
        self.message_service = message_service
        self.task_service = task_service
        self.student_repo = student_repo
        self.lecturer_repo = lecturer_repo
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

    # async def attach_lecturer_profile(self, user_id: UUID):
    #     pass

    # async def create_hod(self, user_data: LecturerCreate) -> User:
    #     async with self.session.begin():
    #         user = await self.user_repo.create_user(self.session, user_data)
    #         return user

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
            user = await self.user_repo.get_one_by_id(
                self.session, id, depth=1
            )
            return user

    async def get_lecturer_dashboard_summary(
        self, lecturer_id: UUID
    ) -> LecturerDashboardSummary:
        return await self.course_service.get_lecturer_dashboard_summary(
            lecturer_id
        )

    async def get_student_dashboard_summary(
        self, student_id: UUID
    ) -> StudentDashboardSummary:
        courses = await self.course_service.get_student_courses(student_id)
        total_course_offering = len(courses)
        lectures_completed = sum(
            [course.class_session_attended for course in courses]
        )
        pending_assignments = len([ assigmnet for course in courses for assigmnet in course.pending_tasks if assigmnet.task_type ==  TaskType.ASSIGNMENT ])
        return StudentDashboardSummary(
            total_course_offering=total_course_offering,
            total_lectures_completed=lectures_completed,
            pending_assignments=pending_assignments,
            courses=courses,
        )

    async def get_students(
        self, department_id: UUID | None = None,
        session_id: UUID | None = None,
        admission_session_id: UUID | None = None,
        course_offering_id: UUID | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[StudentDetailsOut]:
        return await self.student_repo.get_students_with_details(
            self.session, department_id, session_id,
            admission_session_id, course_offering_id, skip, limit
        )

    async def get_lecturers(
        self, department_id: UUID | None = None,
        session_id: UUID | None = None,
        course_offering_id: UUID | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[LecturerDetailsOut]:
        return await self.lecturer_repo.get_lecturers_with_details(
            self.session, department_id, session_id,
            course_offering_id, skip, limit
        )
