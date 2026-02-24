from typing import Tuple, Union, cast, overload
from pydantic import UUID4
from sqlalchemy import JSON, Select, exists, func, select, cast as sa_cast
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.common.repo import BaseRepo, PaginatedResult, PAGE_SIZE
from app.api.course.models import Course, CourseLecturer, CourseOffering, CourseStudent
from app.api.institution.models import Department, Semester, Session
from app.api.user.models import LecturerProfile, StudentProfile, User
from app.api.user.schema import LecturerCreate, LecturerDetailsOut, LecturerUpdate, StudentCreate, StudentDetailsOut, StudentUpdate, UserCreate, UserType, UserUpdate


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
                admission_session_id=user_obj.admission_session_id,
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
        users = await self.get_all(con, skip=skip, limit=limit)
        return users

    async def get_user(
        self, con: AsyncSession,
        skip: int | None = None, limit: int | None = None
    ) -> User:
        users = await self.get_all(con, skip, limit)
        return users

class LecturerProfileRepo(BaseRepo[LecturerProfile, LecturerCreate, LecturerUpdate]):
    async def check_if_lecturer_exists(
        self, con: AsyncSession, lecturer_id: UUID4
    ) -> bool:
        query = select(exists().where(LecturerProfile.id == lecturer_id))

        return await con.scalar(query)

    async def _get_lecturers_with_details(
        self, con: AsyncSession,
        department_id: UUID4 | None = None,
        session_id: UUID4 | None = None,
        course_offering_id: UUID4 | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[LecturerDetailsOut]:
        course_offerings_subquery = (
            select(
                func.coalesce(
                    func.json_agg(
                        func.json_build_object(
                            'id', CourseOffering.id,
                            "course_id", Course.id,
                            "semester_id", Semester.id,
                            "session_id", Session.id,
                            "is_active", CourseOffering.is_active,
                            "class_completed", CourseOffering.class_completed,
                            "semester", Semester.name,
                            "course_code", Course.code,
                            "course_name", Course.name,
                        )
                    ),
                    sa_cast([], JSON)
                )
            )
            .select_from(CourseOffering)
            .join(Course, CourseOffering.course_id == Course.id)
            .join(Semester, CourseOffering.semester_id == Semester.id)
            .join(Session, CourseOffering.session_id == Session.id)
            .correlate(CourseOffering)
            .scalar_subquery()
        )
        query = (
            select(
                LecturerProfile.id.label("id"),
                LecturerProfile.user_id.label("user_id"),
                User.first_name.label("first_name"),
                User.last_name.label("last_name"),
                User.email.label("email"),
                User.department_id.label("department_id"),
                LecturerProfile.rank.label("rank"),
                LecturerProfile.title.label("title"),
                LecturerProfile.degree.label("degree"),
                LecturerProfile.status.label("status"),
                Department.name.label("department"),
                course_offerings_subquery.label("course_offerings"),
            )
            .select_from(LecturerProfile)
            .join(User, LecturerProfile.user_id == User.id)
            .join(Department, User.department_id == Department.id)
            .join(CourseLecturer, CourseLecturer.lecturer_id == LecturerProfile.id)
            .join(CourseOffering, CourseOffering.id == CourseLecturer.course_offering_id)
            .join(Session, CourseOffering.session_id == Session.id)
        )

        if department_id is not None:
            query = query.where(Department.id == department_id)

        if session_id is not None:
            query = query.where(Session.id == session_id)

        if course_offering_id is not None:
            query = query.where(
                CourseLecturer.course_offering_id == course_offering_id
            )

        if skip is not None:
            query = query.offset(skip)
        if limit is not None:
            query = query.limit(limit)

        return query


    async def get_lecturers_with_details(
        self, con: AsyncSession,
        department_id: UUID4 | None = None,
        session_id: UUID4 | None = None,
        course_offering_id: UUID4 | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[LecturerDetailsOut]:
        query = self._get_lecturers_with_details(con, department_id, session_id, course_offering_id, skip, limit)
        data = await con.execute(query)
        return [
            LecturerDetailsOut(**row) for row in data.mappings().all()
        ]

    async def get_lecturers_with_details_paginated(
        self, con: AsyncSession,
        department_id: UUID4 | None = None,
        session_id: UUID4 | None = None,
        course_offering_id: UUID4 | None = None,
        skip: int | None = None, limit: int = PAGE_SIZE
    ) -> PaginatedResult[LecturerDetailsOut]:
        query = self._get_lecturers_with_details(con, department_id, session_id, course_offering_id, skip, limit)
        count_query = query.with_only_columns(func.count()).order_by(None)
        total = await con.scalar(count_query)
        items = await self.get_lecturers_with_details(con, department_id, session_id, course_offering_id, skip, limit)
        return PaginatedResult[LecturerDetailsOut](
            page_number=(skip // limit + 1 if skip is not None else 1) if total is not None else 0,
            page_size=limit if limit is not None else 0,
            total_items=total if total is not None else 0,
            items=items,
            total_pages=total // limit + 1 if total is not None else 0,
        )


class StudentProfileRepo(
    BaseRepo[StudentProfile, StudentCreate, StudentUpdate]
):
    async def _get_students_with_details(
        self, con: AsyncSession,
        department_id: UUID4 | None = None,
        session_id: UUID4 | None = None,
        admission_session_id: UUID4 | None = None,
        course_offering_id: UUID4 | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> Select[Tuple[StudentProfile]]:
        course_offerings_subquery = (
            select(
                func.coalesce(
                    func.json_agg(
                        func.json_build_object(
                            'id', CourseOffering.id,
                            "course_id", Course.id,
                            "semester_id", Semester.id,
                            "session_id", Session.id,
                            "is_active", CourseOffering.is_active,
                            "class_completed", CourseOffering.class_completed,
                            "semester", Semester.name,
                            "course_code", Course.code,
                            "course_name", Course.name,
                        )
                    ),
                    sa_cast([], JSON)
                )
            )
            .select_from(CourseOffering)
            .join(Course, CourseOffering.course_id == Course.id)
            .join(Semester, CourseOffering.semester_id == Semester.id)
            .join(Session, CourseOffering.session_id == Session.id)
            .correlate(CourseOffering)
            .scalar_subquery()
        )
        query = (
            select(
                StudentProfile.id.label("id"),
                StudentProfile.matric_number.label("matric_number"),
                StudentProfile.admission_session_id.label("admission_session_id"),
                StudentProfile.status.label("status"),
                User.id.label("user_id"),
                User.first_name.label("first_name"),
                User.last_name.label("last_name"),
                User.email.label("email"),
                User.department_id.label("department_id"),
                Department.name.label("department"),
                course_offerings_subquery.label("course_offerings"),
            )
            .select_from(StudentProfile)
            .join(User, StudentProfile.user_id == User.id)
            .join(Department, User.department_id == Department.id)
            .join(CourseStudent, CourseStudent.student_id == StudentProfile.id)
            .join(CourseOffering, CourseOffering.id == CourseStudent.course_offering_id)
            .join(Session, CourseOffering.session_id == Session.id)
        )

        if department_id is not None:
            query = query.where(Department.id == department_id)

        if session_id is not None:
            query = query.where(Session.id == session_id)

        if admission_session_id is not None:
            query = query.where(
                StudentProfile.admission_session_id == admission_session_id
            )

        if course_offering_id is not None:
            query = query.where(
                CourseStudent.course_offering_id == course_offering_id
            )

        if skip is not None:
            query = query.offset(skip)
        if limit is not None:
            query = query.limit(limit)

        return query

    async def get_students_with_details(
        self, con: AsyncSession,
        department_id: UUID4 | None = None,
        session_id: UUID4 | None = None,
        admission_session_id: UUID4 | None = None,
        course_offering_id: UUID4 | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[StudentDetailsOut]:
        query = await self._get_students_with_details(con, department_id, session_id, admission_session_id, course_offering_id, skip, limit)
        data = await con.execute(query)
        return [
            StudentDetailsOut(**row) for row in data.mappings().all()
        ]
    async def get_students_with_details_paginated(
        self, con: AsyncSession,
        department_id: UUID4 | None = None,
        session_id: UUID4 | None = None,
        admission_session_id: UUID4 | None = None,
        course_offering_id: UUID4 | None = None,
        skip: int | None = None, limit: int = PAGE_SIZE
    ) -> PaginatedResult[StudentDetailsOut]:
        query = await self._get_students_with_details(con, department_id, session_id, admission_session_id, course_offering_id, skip, limit)

        count_query = query.with_only_columns(func.count()).order_by(None).limit(None).offset(None)
        total = await con.scalar(count_query)
        items = await self.get_students_with_details(con, department_id, session_id, admission_session_id, course_offering_id, skip, limit)
        return PaginatedResult[StudentDetailsOut](
            page_number=(skip // limit + 1 if skip is not None else 1) if total is not None else 0,
            page_size=limit if limit is not None else 0,
            total_items=total if total is not None else 0,
            items=items,
            total_pages=total // limit + 1 if total is not None else 0,
        )
