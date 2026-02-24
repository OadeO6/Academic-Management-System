from typing import Annotated

from pydantic import UUID4
from app.api.user.dependencies import get_lecturer_profile_repo
from app.api.user.repository import LecturerProfileRepo
import asyncpg
from uuid import UUID

from sqlalchemy.exc import IntegrityError

from app.api.user.schema import LecturerDashboardSummary
from app.exceptions import CourseOfferingDependencyError, DuplicateData, DataNotFound, is_foreign_key_violation, is_unique_violation
from fastapi import Depends

from app.api.institution.dependencies import get_semester_repo, get_session_repo
from app.api.institution.repository import SemesterRepo, SessionRepo
from app.api.course.dependencies import (
    get_attendance_repo, get_class_session_repo, get_course_lecturer_repo, get_course_offering_repo, get_course_repo, get_course_student_repo, get_message_repo, get_task_repo
)
from app.api.common.dependencies import DbCon
from app.api.course.models import Attendance, ClassSession, Course, CourseOffering, CourseStudent, Message, TaskStudent
from app.api.course.repository import (
    AttendanceRepo, ClassSessionRepo, CourseLecturerRepo, CourseOfferingRepo, CourseRepo, CourseStudentRepo, MessageRepo, TaskRepo
)
from app.api.course.schema import AttendanceCreate, ClassSessionCreate, ClassSessionDetailed, ClassSessionOut, CourseCreate, CourseLecturerCreate, CourseLecturerOut, CourseOfferingCreate, CourseOfferingCreateReq, CourseOfferingOutDetailed, CourseOfferingOutLecturer, CourseOfferingOutMain, CourseOfferingOutStudent, CourseStudentCreate, EventStatus, MessageCreate, TaskCreate, TaskOut, TaskStudentFlat, TaskStudentStatus, TaskStudentStatusExtended



class CourseService:
    def __init__(
        self,
        session: DbCon,
        course_repo: Annotated[CourseRepo, Depends(get_course_repo)],
        course_student_repo: Annotated[
            CourseStudentRepo, Depends(get_course_student_repo)
        ],
        course_lecturer_repo: Annotated[
            CourseLecturerRepo, Depends(get_course_lecturer_repo)
        ],
        course_offering_repo: Annotated[
            CourseOfferingRepo, Depends(get_course_offering_repo)
        ],
        session_repo: Annotated[
            SessionRepo, Depends(get_session_repo)
        ],
        semester_repo: Annotated[
            SemesterRepo, Depends(get_semester_repo)
        ],
        lecturer_profile_repo: Annotated[
        LecturerProfileRepo, Depends(get_lecturer_profile_repo)
        ],
        task_repo: Annotated[TaskRepo, Depends(get_task_repo)],
        message_repo: Annotated[MessageRepo, Depends(get_message_repo)],
        class_session_repo: Annotated[
            ClassSessionRepo, Depends(get_class_session_repo)
        ],
        attendance_repo: Annotated[
            AttendanceRepo, Depends(get_attendance_repo)
        ],
    ):
        self.course_repo = course_repo
        self.course_student_repo = course_student_repo
        self.course_lecturer_repo = course_lecturer_repo
        self.course_offering_repo = course_offering_repo
        self.lecturer_profile_repo = lecturer_profile_repo
        self.class_session_repo = class_session_repo
        self.session_repo = session_repo
        self.semester_repo = semester_repo
        self.attendance_repo = attendance_repo
        self.task_repo = task_repo
        self.message_repo = message_repo
        self.session = session

    async def create_course(self, course_data: CourseCreate) -> Course:
        async with self.session.begin():
            course = await self.course_repo.create_one(
                self.session, course_data
            )
            return course

    async def get_courses(
        self, skip: int | None = None, limit: int | None = None
    ) -> list[Course]:
        async with self.session.begin():
            users = await self.course_repo.get_all(
                self.session, skip=skip, limit=limit
            )
            return users

    async def get_course(
        self, id: UUID
    ) -> Course | None:
        async with self.session.begin():
            course = await self.course_repo.get_one_by_id(self.session, id)
            return course

    async def create_course_offering(
        self, course_offering_data: CourseOfferingCreateReq
    ) -> CourseOffering:
        async with self.session.begin():
            session_id = await self.session_repo.get_session_id_by_semester(
                self.session, course_offering_data.semester_id
            )
            if not session_id:
                raise DataNotFound(
                    code=400,
                    message="Invalid semester id",
                )
            course_offering_create = CourseOfferingCreate(
                **course_offering_data.dict(exclude_unset=True), session_id=session_id
            )
            try:
                course_offering = await self.course_offering_repo.create_one(
                    self.session, course_offering_create
                )
            except IntegrityError as e:
                if is_unique_violation(e):
                    raise DuplicateData(
                        code=400,
                        message="Course offering already exists",
                    )
                raise
            return course_offering

    async def get_sesion_course_offerings(
        self, semester_id: UUID | None = None,
        session_id: UUID | None = None,
        is_active: bool | None = None,
        skip: int | None = None,
        limit: int | None = None
    ) -> list[CourseOfferingOutDetailed]:
        async with self.session.begin():
            if session_id or semester_id or is_active:
                course_offerings = await self.course_offering_repo.get_session_course_offerings(
                    self.session, semester_id, session_id, is_active, skip=skip, limit=limit
                )
            else:
                course_offerings = await self.course_offering_repo.get_current_sesion_course_offerings(
                    self.session, skip=skip, limit=limit
                )
            return course_offerings


    async def get_course_offering(
        self, id: UUID
    ) -> CourseOffering | None:
        async with self.session.begin():
            course_offering = await self.course_offering_repo.get_one_by_id(
                self.session, id, depth=1
            )
            return course_offering

    async def register_course_student(
        self, reg_obj: CourseStudentCreate,
    ) -> CourseStudent:
        try:
            async with self.session.begin():
                course_student = await self.course_student_repo.register_course(
                    self.session, reg_obj
                )
                return course_student

        except IntegrityError as e:
            if is_foreign_key_violation(e) and "course_offering" in str(e.orig):
                raise CourseOfferingDependencyError()
            if is_unique_violation(e):
                raise DuplicateData(
                    code=400,
                    message="Student already registered",
                )
            raise

    async def assign_course_lecturer(
        self, lecture_assign_obj: CourseLecturerCreate
    ) -> CourseLecturerOut:
        async with self.session.begin():
            lecturer = await self.lecturer_profile_repo.check_if_lecturer_exists(
                self.session, lecturer_id=lecture_assign_obj.lecturer_id
            )
            if not lecturer:
                raise DataNotFound(
                    code=400,
                    message="Lecturer not found",
                )
            try:
                course_lecturer = await self.course_lecturer_repo.assign_lecturer(
                    self.session, lecture_assign_obj
                )
            except IntegrityError as e:
                if is_foreign_key_violation(e) and "course_offering" in str(e.orig):
                    raise CourseOfferingDependencyError()

                if is_unique_violation(e):
                    raise DuplicateData(
                        code=400,
                        message="Lecturer already assigned to this course"
                    )
                raise
            return course_lecturer


    async def get_lecturer_dashboard_summary(
        self, lecturer_id: UUID
    ) -> LecturerDashboardSummary:
        async with self.session.begin():
            courses =  await self.course_lecturer_repo.get_course_lecturers_with_details(
                self.session, lecturer_id
            )
            total_lectures_completed = sum(
                [course.lecture_completed for course in courses]
            )

            return LecturerDashboardSummary(
                total_course=len(courses),
                total_lectures_completed=total_lectures_completed,
                courses=courses,
            )

    async def get_student_courses(
        self, student_id: UUID
    ) -> list[CourseOfferingOutStudent]:
        async with self.session.begin():
            courses = await self.course_student_repo.get_course_students_with_details(
                self.session, student_id
            )
            return courses

    async def get_lecturer_courses(
        self, lecturer_id: UUID
    ) -> list[CourseOfferingOutLecturer]:
        async with self.session.begin():
            courses = await self.course_lecturer_repo.get_course_lecturers_with_details(
                self.session, lecturer_id
            )
            return courses

    async def get_course_general(
        self,
        session_id: UUID,
        semester_id: UUID | None = None,
        department_id: UUID | None = None,
        skip: int | None = None,
        limit: int | None = None
    ) -> list[CourseOfferingOutMain]:
        async with self.session.begin():
            courses = await self.course_offering_repo.get_courses(
                self.session, session_id, semester_id, department_id, skip=skip, limit=limit
            )
            return courses

    # ==========================================================================
    # Message
    # ==========================================================================

    async def get_lecturer_create_announcement(
            self, announcement_data: MessageCreate
    ) -> Message:
        async with self.session.begin():
            return await self.message_repo.create_one(
                self.session, announcement_data
            )

    async def get_lecturer_announcement(
        self, lecturer_id: UUID,
        course_offering_id: UUID | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[Message]:
        async with self.session.begin():
            messages = await self.message_repo.get_teacher_messages(
                self.session, lecturer_id,
                course_offering_id, skip=skip, limit=limit
            )
            return messages

    async def get_announcement_student(
        self, student_id: UUID,
        read: bool | None = None,
        course_offering_id: UUID | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[Message]:
        async with self.session.begin():
            messages = await self.message_repo.get_student_messages(
                self.session, student_id, read,
                course_offering_id, skip=skip, limit=limit
            )
            return messages

    async def student_mark_announcement_read(
        self, student_id: UUID,
        message_id: UUID,
        read: bool
    ) -> bool:
        async with self.session.begin():
            return await self.message_repo.student_mark_message(
                self.session, student_id, message_id, read
            )

    # ==========================================================================
    # Task
    # ==========================================================================

    async def get_student_tasks(
        self, student_id: UUID,
        course_offering_id: UUID | None = None,
        status: TaskStudentStatusExtended | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[TaskStudentFlat]:
        async with self.session.begin():
            tasks = await self.task_repo.get_student_tasks(
                self.session, student_id,
                course_offering_id, status,
                skip=skip, limit=limit
            )
            return tasks


    async def create_task(
        self, task_data: TaskCreate
    ):
        async with self.session.begin():
            lecturer_assigned = await self.course_lecturer_repo.check_if_lecturer_is_assigned_to_course(
                self.session, task_data.lecturer_id, task_data.course_offering_id
            )
            if not lecturer_assigned:
                raise CourseOfferingDependencyError(
                    message="Lecturer not assigned to this course offering",
                    invalid_ref="course_offering"
                )
            task = await self.task_repo.create_one(
                self.session, task_data
            )
            return task


    async def get_course_offering_tasks(
        self, course_offering_id: UUID,
        status: EventStatus | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[TaskOut]:
        async with self.session.begin():
            filter = {}
            if course_offering_id is not None:
                filter.update({self.task_repo.model.course_offering_id: course_offering_id})
            if status is not None:
                filter.update({self.task_repo.model.status: status})
            tasks = await self.task_repo.get_all(
                self.session, filter=filter or None,
                skip=skip, limit=limit
            )
            return tasks

    async def student_complete_task(
        self, student_id: UUID4,
        task_id: UUID4,
        late: bool = False
    ) -> TaskStudent:
        async with self.session.begin():
            return await self.task_repo.student_mark_task_completed(
                self.session, student_id, task_id,
                TaskStudentStatus.COMPLETED_LATE if late else TaskStudentStatus.COMPLETED
            )

    async def grade_task(
        self,
        student_id: UUID4,
        task_id: UUID4,
        grade: int,
        lecturer_id: UUID4 | None = None
    ) -> TaskStudent:
        async with self.session.begin():
            return await self.task_repo.grade_task(
                self.session,
                task_id,
                student_id,
                grade,
                lecturer_id
            )

    async def mark_attendance(
        self,
        attendance_obj: AttendanceCreate
    ) -> Attendance:
        async with self.session.begin():
            return await self.attendance_repo.create_one(
                self.session, attendance_obj
            )

    async def get_attendance(
        self, class_session_id: UUID,
        skip: int | None = None, limit: int | None = None
    ) -> list[Attendance]:
        async with self.session.begin():
            filter = {}
            if class_session_id is not None:
                filter.update(
                    {self.attendance_repo.model.class_session_id: class_session_id}
                )
            return await self.attendance_repo.get_all(
                self.session, filter=filter,
                skip=skip, limit=limit
            )

    async def create_class_session(
        self, class_session_data: ClassSessionCreate
    ) -> ClassSession:
        async with self.session.begin():
            class_session = await self.class_session_repo.create_one(
                self.session, class_session_data
            )
            return class_session


    async def get_class_sessions(
        self, course_offering_id: UUID,
        detail: bool = False,
        skip: int | None = None, limit: int | None = None
    ) -> list[ClassSessionOut] | list[ClassSessionDetailed]:
        async with self.session.begin():
            filter = {}
            if course_offering_id is not None:
                filter.update(
                    {self.class_session_repo.model.course_offering_id: course_offering_id}
                )
            class_sessions = await self.class_session_repo.get_all(
                self.session, filter=filter, depth=1 if detail else 0,
                skip=skip, limit=limit,
            )
            if detail:
                return [
                    ClassSessionDetailed.model_validate(class_session)
                    for class_session in class_sessions
                ]
            else:
                return [
                    ClassSessionOut.model_validate(class_session)
                    for class_session in class_sessions
                ]

    async def get_class_session(
        self, id: UUID
    ) -> ClassSession | None:
        async with self.session.begin():
            class_session = await self.class_session_repo.get_one_by_id(
                self.session, id, depth=1
            )
            return class_session
