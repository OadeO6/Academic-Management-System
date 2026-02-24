from uuid import UUID as _UUID, uuid4
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, String, Integer, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.api.course.schema import AttendanceStatus, ClassSessionStatus, EventStatus, TaskStudentStatus, TaskType

from ..common.models import Base


class Course(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    name: Mapped[str] = mapped_column(String(255))
    code: Mapped[str] = mapped_column(String(50))

    overview: Mapped[str] = mapped_column(String(1000), nullable=True)
    level: Mapped[int] = mapped_column(Integer)

    department_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("department.id")
    )

    course_offerings: Mapped[list["CourseOffering"]] = relationship("CourseOffering", back_populates="course")
    department: Mapped["Department"] = relationship("Department", back_populates="courses")


class CourseOffering(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    course_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("course.id")
    )

    semester_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("semester.id")
    )
    session_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("session.id")
    )
    is_active: Mapped[bool] = mapped_column(default=True)
    class_completed: Mapped[int] = mapped_column(Integer, default=0)

    course: Mapped["Course"] = relationship("Course", back_populates="course_offering")

    course_lecturers: Mapped[list["CourseLecturer"]] = relationship(
        "CourseLecturer", back_populates="course_offering"
    )

    course_students: Mapped[list["CourseStudent"]] = relationship(
        "CourseStudent", back_populates="course_offering"
    )
    semester: Mapped["Semester"] = relationship("Semester", back_populates="course_offerings")
    session: Mapped["Session"] = relationship("Session", back_populates="course_offerings")
    course: Mapped["Course"] = relationship("Course", back_populates="course_offerings")

    __table_args__ = (
        UniqueConstraint("course_id", "semester_id", "session_id"),
    )


class CourseLecturer(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    lecturer_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("lecturer_profile.id")
    )

    course_offering_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("course_offering.id")
    )

    class_completed: Mapped[int] = mapped_column(Integer, default=0)

    status: Mapped[str] = mapped_column(String(20), nullable=True)
    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc)
    )

    lecturer: Mapped["LecturerProfile"] = relationship(
        "LecturerProfile", back_populates="course_lecturers", lazy="noload"
    )
    course_offering: Mapped["CourseOffering"] = relationship(
        "CourseOffering", back_populates="course_lecturers", lazy="noload"
    )

    __table_args__ = (
        UniqueConstraint("course_offering_id", "lecturer_id"),
    )


class CourseStudent(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    student_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("student_profile.id")
    )

    course_offering_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("course_offering.id")
    )
    class_completed: Mapped[int] = mapped_column(Integer, default=0)

    registered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc),
    )

    student: Mapped["StudentProfile"] = relationship(
        "StudentProfile", back_populates="course_students", lazy="noload"
    )
    course_offering: Mapped["CourseOffering"] = relationship(
        "CourseOffering", back_populates="course_students", lazy="noload"
    )

    __table_args__ = (
        UniqueConstraint("course_offering_id", "student_id"),
    )


class ClassSession(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    course_offering_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("course_offering.id")
    )
    lecturer_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("lecturer_profile.id")
    )
    status: Mapped[ClassSessionStatus] = mapped_column(
        Enum(ClassSessionStatus, name="class_session_status", create_type=True),
        default=ClassSessionStatus.ONGOING
    )
    start: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc),
    )
    end: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    attendance: Mapped[list["Attendance"]] = relationship(
        "Attendance", back_populates="class_session", lazy="noload"
    )


class Attendance(Base):
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    class_session_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("class_session.id")
    )
    marked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc),
    )
    student_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("student_profile.id")
    )
    # If no row is found, then it is assumed that the student has not attended
    # So basically no row and PENDING means that the student has not attended
    status: Mapped[AttendanceStatus] = mapped_column(
        Enum(
            AttendanceStatus, name="attendance_status",
            create_type=True, default=AttendanceStatus.PRESENT
        )
    )

    class_session: Mapped["ClassSession"] = relationship(
        "ClassSession", back_populates="attendance", lazy="noload"
    )


class Message(Base):
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    course_offering_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("course_offering.id")
    )
    lecturer_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("lecturer_profile.id")
    )
    title: Mapped[str] = mapped_column(String(length=1000), nullable=True)
    details: Mapped[str] = mapped_column(String(length=1000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc)
    )

    message_students: Mapped[list["MessageStudent"]] = relationship(
        "MessageStudent", back_populates="message", lazy="noload"
    )




class MessageStudent(Base):
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    student_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("student_profile.id")
    )
    message_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("message.id")
    )
    read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc)
    )
    message: Mapped["Message"] = relationship(
        "Message", back_populates="message_students", lazy="noload"
    )
    student: Mapped["StudentProfile"] = relationship(
        "StudentProfile", back_populates="message_students", lazy="noload"
    )

    __table_args__ = (
        UniqueConstraint("student_id", "message_id"),
    )

class Task(Base):
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    course_offering_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("course_offering.id")
    )
    task_type: Mapped[TaskType] = mapped_column(
        Enum(TaskType, name="task_type", create_type=True)
    )
    lecturer_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("lecturer_profile.id")
    )
    title: Mapped[str] = mapped_column(String(length=1000), nullable=True)
    details: Mapped[str] = mapped_column(String(length=1000), nullable=True)
    status: Mapped[EventStatus] = mapped_column(
        Enum(
            EventStatus, name="event_status", create_type=True,
        ),
        default=EventStatus.UPCOMING
    )
    deadline: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc)
    )

    task_students: Mapped[list["TaskStudent"]] = relationship(
        "TaskStudent", back_populates="task"
    )


# For now a row is only created for when a student has completed the task
class TaskStudent(Base):
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    task_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("task.id")
    )
    student_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("student_profile.id")
    )
    status: Mapped[TaskStudentStatus] = mapped_column(
        Enum(
            TaskStudentStatus, name="task_student_status",
            create_type=True, default=TaskStudentStatus.COMPLETED
        )
    )
    grade: Mapped[int] = mapped_column(Integer, nullable=True)

    task: Mapped["Task"] = relationship(
        "Task", back_populates="task_students", lazy="noload"
    )
    student: Mapped["StudentProfile"] = relationship(
        "StudentProfile", back_populates="task_students", lazy="noload"
    )

    __table_args__ = (
        UniqueConstraint("task_id", "student_id"),
    )
