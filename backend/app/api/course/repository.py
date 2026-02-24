from datetime import date
from pydantic import UUID4
from sqlalchemy import JSON, Boolean, String, alias, exists, func, select, case, and_, or_, cast, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.common.repo import BaseRepo
from app.api.course.models import Attendance, ClassSession, Course, CourseLecturer, CourseOffering, CourseStudent, Message, MessageStudent, Task, TaskStudent
from app.api.course.schema import AttendanceCreate, AttendanceStatus, AttendanceUpdate, ClassSessionCreate, ClassSessionUpdate, CourseCreate, CourseLecturerCreate, CourseLecturerOut, CourseLecturerUpdate, CourseOfferingCreate, CourseOfferingOutLecturer, CourseOfferingOutMain, CourseOfferingOutStudent, CourseOfferingOutDetailed, CourseOfferingUpdate, CourseStudentCreate, CourseStudentUpdate, CourseUpdate, MessageCreate, MessageUpdate, StudentClassSessionStat, StudentMessageOut, TaskCreate, TaskOut, TaskStudentCreate, TaskStudentFlat, TaskStudentStatus, TaskStudentStatusExtended, TaskStudentUpdate, TaskUpdate
from app.api.institution.models import Semester, Session
from app.api.user.models import LecturerProfile, User
from app.exceptions import DataNotFound, DuplicateData


class CourseRepo(BaseRepo[Course, CourseCreate, CourseUpdate]):
    pass


class CourseOfferingRepo(
        BaseRepo[CourseOffering, CourseOfferingCreate, CourseOfferingUpdate]
):
    async def get_current_sesion_course_offerings(
        self, conn: AsyncSession,
        skip: int | None = None,
        limit: int | None = None
    ) -> list[CourseOfferingOutDetailed]:
        return await self.get_session_course_offerings(
            conn, session_id=None, skip=skip, limit=limit
        )

    async def get_session_course_offerings(
        self, conn: AsyncSession,
        semester_id: UUID4 | None = None,
        session_id: UUID4 | None = None,
        is_active: bool | None = None,
        skip: int | None = None,
        limit: int | None = None
    ) -> list[CourseOfferingOutDetailed]:
        query = (
            select(
                CourseOffering.id.label("id"),
                CourseOffering.course_id.label("course_id"),
                CourseOffering.semester_id.label("semester_id"),
                CourseOffering.session_id.label("session_id"),
                CourseOffering.class_completed.label("class_completed"),
                Course.name.label("course_name"),
                Semester.name.label("semester"),
                Session.name.label("session"),
                Course.code.label("course_code"),
                Semester.id.label("semester_id"),
                Session.id.label("session_id"),
            )
            .select_from(CourseOffering)
            .join(
                Course,
                CourseOffering.course_id == Course.id,
            )
            .join(
                Semester,
                CourseOffering.semester_id == Semester.id,
            )
            .join(
                Session,
                CourseOffering.session_id == Session.id,
            )
        )
        if session_id is not None:
            query = query.where(
                CourseOffering.session_id == session_id,
            )
        else:
            query = query.where(
                and_(
                    Semester.start_date <= date.today(), # Started in the past (or today)
                    or_(
                        Semester.end_date >= date.today(),
                        Semester.end_date == None
                    )
                )
            )
        if is_active is not None:
            query = query.where(
                CourseOffering.is_active == is_active
            )
        if semester_id is not None:
            query = query.where(
                CourseOffering.semester_id == semester_id
            )
        if skip is not None:
            query = query.offset(skip)
        if limit is not None:
            query = query.limit(limit)
        data = await conn.execute(query)
        return [
            CourseOfferingOutDetailed(**row) for row in data.mappings().all()
        ]

    async def get_courses(
        self, conn: AsyncSession,
        session_id: UUID4,
        semester_id: UUID4 | None = None,
        department_id: UUID4 | None = None,
        skip: int | None = None,
        limit: int | None = None
    ) -> list[CourseOfferingOutMain]:
        course_lecturers_subquery = (
            select(
                func.coalesce(
                    func.json_agg(
                        func.json_build_object(
                            'id', LecturerProfile.id,
                            'rank', LecturerProfile.rank,
                            'title', LecturerProfile.title,
                            'degree', LecturerProfile.degree,
                            'status', LecturerProfile.status,
                            'user_id', LecturerProfile.user_id,
                            "first_name", User.first_name,
                            "last_name", User.last_name,
                            "email", User.email,
                        )
                    ),
                    cast([], JSON)
                )
            )
            .select_from(LecturerProfile)
            .join(
                User,
                User.id == LecturerProfile.user_id
            )
            .join(
                CourseLecturer,
                CourseLecturer.lecturer_id == LecturerProfile.id
            )
            .where(CourseLecturer.course_offering_id == CourseOffering.id)
            .correlate(CourseOffering)
            .scalar_subquery()
        )

        query = (
            select(
                CourseOffering.id.label("course_offering_id"),
                Course.name.label("course_name"),
                Semester.name.label("semester"),
                Session.name.label("session"),
                Course.code.label("course_code"),
                Semester.id.label("semester_id"),
                Session.id.label("session_id"),
                CourseOffering.class_completed.label("total_class_session"),
                course_lecturers_subquery.label("course_lecturers"),
            )
            .select_from(CourseOffering)
            .join(Course, CourseOffering.course_id == Course.id)
            .join(Semester, CourseOffering.semester_id == Semester.id)
            .join(Session, CourseOffering.session_id == Session.id)
            .where(CourseOffering.session_id == session_id)
        )
        if semester_id:
            query = query.where(CourseOffering.semester_id == semester_id)

        if department_id:
            query = query.where(Course.department_id == department_id)

        if skip is not None:
            query = query.offset(skip)
        if limit is not None:
            query = query.limit(limit)

        data = await conn.execute(query)
        return [
            CourseOfferingOutMain(**row) for row in data.mappings().all()
        ]


class CourseStudentRepo(
    BaseRepo[CourseStudent, CourseStudentCreate, CourseStudentUpdate]
):
    async def register_course(
        self, conn: AsyncSession,
        create_obj: CourseStudentCreate
    ) -> CourseStudent:
        return await self.create_one(conn, create_obj)

    async def get_course_students_with_details(
        self, conn: AsyncSession,
        student_id: UUID4
    ) -> list[CourseOfferingOutStudent]:
        uncompleted_tasks_subquery = (
            select(
                func.coalesce(
                    func.json_agg(
                        func.json_build_object(
                            'id', Task.id,
                            'title', Task.title,
                            'task_type', Task.task_type,
                            'deadline', Task.deadline,
                            'created_at', Task.created_at,
                            'status', Task.status,
                            'details', Task.details,
                            'updated_at', Task.updated_at,
                            "lecturer_id", Task.lecturer_id,
                            "course_offering_id", Task.course_offering_id,
                        )
                    ),
                    cast([], JSON)
                )
            )
            .select_from(Task)
            .outerjoin(
                TaskStudent,
                and_(
                    Task.id == TaskStudent.task_id,
                    TaskStudent.student_id == student_id
                )
            )
            .where(
                Task.course_offering_id == CourseOffering.id,
                or_(
                    TaskStudent.status != TaskStudentStatus.COMPLETED,
                    TaskStudent.status.is_(None)
                )
            )
            .correlate(CourseOffering)
            .scalar_subquery()
        )

        course_lecturers_subquery=(
            select(
                func.coalesce(
                    func.json_agg(
                        func.json_build_object(
                            'id', LecturerProfile.id,
                            'rank', LecturerProfile.rank,
                            'title', LecturerProfile.title,
                            'degree', LecturerProfile.degree,
                            'status', LecturerProfile.status,
                            'user_id', LecturerProfile.user_id,
                            "first_name", User.first_name,
                            "last_name", User.last_name,
                            "email", User.email,
                        )
                    ),
                    cast([], JSON)
                )
            )
            .select_from(LecturerProfile)
            .join(
                User,
                User.id == LecturerProfile.user_id
            )
            .join(
                CourseLecturer,
                CourseLecturer.lecturer_id == LecturerProfile.id
            )
            .where(CourseLecturer.course_offering_id == CourseOffering.id)
            .correlate(CourseOffering)
            .scalar_subquery()
        )




        query = (
            select(
                CourseStudent.class_completed.label("class_session_attended"),
                CourseOffering.id.label("course_offering_id"),
                CourseOffering.class_completed.label(
                    "total_class_session"
                ),
                Course.name.label("course_name"),
                Semester.name.label("semester"),
                Session.name.label("session"),
                Course.code.label("course_code"),
                Semester.id.label("semester_id"),
                Session.id.label("session_id"),
                uncompleted_tasks_subquery.label("pending_tasks"),
                course_lecturers_subquery.label("course_lecturers"),
            )
            .select_from(CourseStudent)
            .join(
                CourseOffering,
                CourseStudent.course_offering_id == CourseOffering.id,
            )
            .join(
                Course,
                CourseOffering.course_id == Course.id,
            )
            .join(
                Semester,
                CourseOffering.semester_id == Semester.id,
            )

            .join(
                Session,
                CourseOffering.session_id == Session.id,
            )
            .where(
                CourseStudent.student_id == student_id
            )
        )
        data = await conn.execute(query)
        return [
            CourseOfferingOutStudent(**row) for row in data.mappings().all()
        ]

    async def get_student_class_history(
        self, conn: AsyncSession,
        student_id: UUID4,
        class_session_id: UUID4 | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[StudentClassSessionStat]:
        query = (
            select(
                CourseStudent.student_id.label("student_id"),
                Attendance.class_session_id.label("class_session_id"),
                Attendance.marked_at.label("marked_at"),
                case(
                    (Attendance.status == AttendanceStatus.COMPLETED, True),
                    else_=False
                ).label("attended"),
                ClassSession.start.label("class_session_time"),
            )
            .select_from(CourseStudent)
            .join(
                CourseOffering,
                CourseStudent.course_offering_id == CourseOffering.id,
            )
            # .outerjoin(
            #     Attendance,
            #     and_(
            #         Attendance.student_id == CourseStudent.student_id,
            #         Attendance.class_session_id == ClassSession.id,
            #     )
            # )
            .join(
                ClassSession,
                CourseOffering.session_id == ClassSession.id,
            )
            .outerjoin(
                Attendance,
                CourseStudent.student_id == Attendance.student_id,
            )
            .where(CourseStudent.student_id == student_id)
        )

        if class_session_id is not None:
            query = query.where(
                ClassSession.id == class_session_id
            )
        if skip is not None:
            query = query.offset(skip)
        if limit is not None:
            query = query.limit(limit)
        data = await conn.execute(query)
        return [StudentClassSessionStat(**row) for row in data.scalars().all()]



class CourseLecturerRepo(
    BaseRepo[CourseLecturer, CourseLecturerCreate, CourseLecturerUpdate]
):
    async def assign_lecturer(
        self, conn: AsyncSession,
        create_obj: CourseLecturerCreate
    ) -> CourseLecturerOut:
        return await self.create_one(conn, create_obj)


    async def check_if_lecturer_is_assigned_to_course(
        self, conn: AsyncSession,
        lecturer_id: UUID4,
        course_offering_id: UUID4
    ) -> bool:
        query = (
            select(
                exists().where(
                    and_(
                        CourseLecturer.lecturer_id == lecturer_id,
                        CourseLecturer.course_offering_id == course_offering_id
                    )
                )
            )
        )
        return await conn.scalar(query)

    async def get_course_lecturers_with_details(
        self, conn: AsyncSession,
        lecturer_id: UUID4
    ) -> list[CourseOfferingOutLecturer]:
        course_lecturers_subquery=(
            select(
                func.coalesce(
                    func.json_agg(
                        func.json_build_object(
                            'id', LecturerProfile.id,
                            'rank', LecturerProfile.rank,
                            'title', LecturerProfile.title,
                            'degree', LecturerProfile.degree,
                            'status', LecturerProfile.status,
                            'user_id', LecturerProfile.user_id,
                            "first_name", User.first_name,
                            "last_name", User.last_name,
                            "email", User.email,
                        )
                    ),
                    cast([], JSON)
                )
            )
            .select_from(LecturerProfile)
            .join(
                User,
                User.id == LecturerProfile.user_id
            )
            .join(
                CourseLecturer,
                CourseLecturer.lecturer_id == LecturerProfile.id
            )
            .where(CourseLecturer.course_offering_id == CourseOffering.id)
            .correlate(CourseOffering)
            .scalar_subquery()
        )


        query = (
                select(
                    CourseLecturer.class_completed.label("lecture_completed"),
                    CourseOffering.id.label("course_offering_id"),
                    Course.name.label("course_name"),
                    Course.code.label("course_code"),
                    Semester.name.label("semester"),
                    Session.name.label("session"),
                    Course.code.label("course_coode"),
                    Semester.id.label("semester_id"),
                    Session.id.label("session_id"),
                    CourseLecturer.assigned_at.label("assigned_at"),
                    CourseOffering.class_completed.label("total_class_session"),
                    course_lecturers_subquery.label("course_lecturers"),

                )
                .select_from(CourseLecturer)
                .join(
                    CourseOffering,
                    CourseLecturer.course_offering_id == CourseOffering.id,
                )
                .join(
                    Course,
                    CourseOffering.course_id == Course.id,
                )
                .join(
                    Semester,
                    CourseOffering.semester_id == Semester.id,
                )
                .join(
                    Session,
                    CourseOffering.session_id == Session.id,
                )
                .where(
                    CourseLecturer.lecturer_id == lecturer_id
                )
        )
        data = await conn.execute(query)
        return [
            CourseOfferingOutLecturer(**row) for row in data.mappings().all()
        ]


class MessageRepo(
    BaseRepo[Message, MessageCreate, MessageUpdate]
):
    async def get_teacher_messages(
        self, con: AsyncSession,
        teacher_id: UUID4,
        course_offering_id: UUID4 | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[Message]:
        filter = {self.model.lecturer_id: teacher_id}
        if course_offering_id is not None:
            filter[self.model.course_offering_id] = course_offering_id
        return await self.get_all(
            con, filter=filter,
            skip=skip, limit=limit
        )

    async def get_student_messages(
        self, con: AsyncSession,
        student_id: UUID4,
        read: bool | None = None,
        course_offering_id: UUID4 | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[StudentMessageOut]:
        query = (
            select(
                Message.id.label("id"),
                Message.course_offering_id.label("course_offering_id"),
                Message.lecturer_id.label("lecturer_id"),
                Message.title.label("title"),
                Message.details.label("details"),
                Message.created_at.label("created_at"),
                Message.updated_at.label("updated_at"),
                func.coalesce(
                    cast(MessageStudent.read, Boolean),
                    False
                ).label("read"),
            )
            .select_from(Message)
            .outerjoin(
                MessageStudent,
                and_(
                    Message.id == MessageStudent.message_id,
                    MessageStudent.student_id == student_id
                )
            )
            .join(
                CourseOffering,
                Message.course_offering_id == CourseOffering.id
            )
        )

        if read is not None:
            if read is True:
                query = query.where(
                    MessageStudent.read.is_(True)
                )
            query = query.where(
                or_(
                    MessageStudent.read.is_(True),
                    MessageStudent.read.is_(None)
                )
            )

        if course_offering_id is not None:
            query = query.where(
                self.model.course_offering_id == course_offering_id
            )
        if skip is not None:
            query = query.offset(skip)

        if limit is not None:
            query = query.limit(limit)
        data = await con.execute(query)
        return [
            StudentMessageOut(**row) for row in data.mappings().all()
        ]

    async def student_mark_message(
        self, con: AsyncSession,
        student_id: UUID4,
        message_id: UUID4,
        read: bool = True
    ) -> bool:
        message = await self.get_one_by_id(con, message_id)
        if not message:
            raise DataNotFound(code=404, message="Message not found")
        query = (
            insert(MessageStudent).values(
                student_id=student_id,
                message_id=message_id,
                read=read
            )
            .on_conflict_do_update(
                index_elements=['student_id', 'message_id'],
                set_=dict(read=read)
            )
        )
        result = await con.execute(query)
        return result.rowcount > 0


class TaskRepo(
    BaseRepo[Task, TaskCreate, TaskUpdate]
):
    async def grade_task(
        self, con: AsyncSession,
        task_id: UUID4,
        student_id: UUID4,
        grade: int,
        lecturer_id: UUID4 | None = None,
    ) -> TaskStudent:
        query = (
            select(TaskStudent)
            .join(
                Task,
                Task.id == TaskStudent.task_id
            )
            .where(TaskStudent.student_id == student_id)
            .where(TaskStudent.task_id == task_id)
        )
        if lecturer_id is not None:
            query = query.where(Task.lecturer_id == lecturer_id)

        result = await con.execute(query)
        data = result.scalar_one_or_none()

        if data is None:
            raise DataNotFound(code=404, message="Task not found")

        data.grade = grade

        await con.flush()

        return data

    async def student_mark_task_completed(
        self, con: AsyncSession,
        student_id: UUID4,
        task_id: UUID4,
        status: TaskStudentStatus = TaskStudentStatus.COMPLETED
    ) -> TaskStudent:
        query = (
            select(Task)
            .join(
                CourseStudent,
                CourseStudent.course_offering_id == Task.course_offering_id
            )
            .where(CourseStudent.student_id == student_id)
            .where(Task.id == task_id)
        )
        result = await con.execute(query)
        task = result.scalar_one_or_none()


        if task is None:
            raise DataNotFound(code=404, message="Task not found or not completed")

        stmt = insert(TaskStudent).values(
            student_id=student_id,
            task_id=task_id,
            status=status
        )

        stmt = stmt.on_conflict_do_update(
            index_elements=['student_id', 'task_id'],
            set_=dict(status=stmt.excluded.status)
        ).returning(TaskStudent)

        result = await con.execute(stmt)
        await con.flush()

        return result.scalar_one()



    async def get_lecturer_tasks(
        self, con: AsyncSession,
        lecturer_id: UUID4,
        course_offering_id: UUID4 | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[TaskOut]:
        filter = {self.model.lecturer_id: lecturer_id}
        if course_offering_id is not None:
            filter[self.model.course_offering_id] = course_offering_id
        return await self.get_all(
            con, filter=filter,
            skip=skip, limit=limit
        )

    async def get_student_tasks(
        self, con: AsyncSession,
        student_id: UUID4,
        course_offering_id: UUID4 | None = None,
        status: TaskStudentStatusExtended | None = None,
        skip: int | None = None, limit: int | None = None
    ) -> list[TaskStudentFlat]:
        query = (
            select(
                Task.id.label("task_id"),
                Task.course_offering_id.label("course_offering_id"),
                Task.task_type.label("task_type"),
                Task.lecturer_id.label("lecturer_id"),
                Task.title.label("title"),
                Task.details.label("details"),
                Task.deadline.label("deadline"),
                Task.created_at.label("created_at"),
                Task.status.label("task_status"),
                func.coalesce(
                    cast(TaskStudent.status, String),
                    TaskStudentStatus.PENDING.value
                ).label("task_student_status"),
                TaskStudent.grade.label("grade"),
                TaskStudent.id.label("task_student_id"),
            )
            .select_from(Task)
            .outerjoin(
                TaskStudent,
                and_(
                    Task.id == TaskStudent.task_id,
                    TaskStudent.student_id == student_id
                )
            )
            .join(
                CourseStudent,
                CourseStudent.course_offering_id == Task.course_offering_id
            )
            .where(CourseStudent.student_id == student_id)
        )
        if course_offering_id is not None:
            query = query.where(
                self.model.course_offering_id == course_offering_id
            )
        if skip is not None:
            query = query.offset(skip)

        if status is not None:
            if status == TaskStudentStatusExtended.GRADED:
                query = query.where(
                    TaskStudent.grade.isnot(None)
                )
            elif status == TaskStudentStatusExtended.COMPLETED:
                query = query.where(
                    or_(
                        TaskStudent.status == TaskStudentStatus.COMPLETED,
                        TaskStudent.status.is_(None)
                    )
                )
            else:
                query = query.where(
                    TaskStudent.status == status
                )

        if limit is not None:
            query = query.limit(limit)
        data = await con.execute(query)
        return [
            TaskStudentFlat(**row) for row in data.mappings().all()
        ]



class TaskStudentRepo(
    BaseRepo[TaskStudent, TaskStudentCreate, TaskStudentUpdate]
):
    pass


class ClassSessionRepo(
    BaseRepo[ClassSession, ClassSessionCreate, ClassSessionUpdate]
):
    pass

class AttendanceRepo(
    BaseRepo[Attendance, AttendanceCreate, AttendanceUpdate]
):
    pass
