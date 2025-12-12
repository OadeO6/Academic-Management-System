from uuid import UUID as _UUID, uuid4
from datetime import datetime, timezone

from sqlalchemy import String, Integer, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from ..common.models import Base


class Course(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    name: Mapped[str] = mapped_column(String(255))
    code: Mapped[str] = mapped_column(String(50))

    department_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("department.id")
    )

    department: Mapped["Department"] = relationship("Department", back_populates="courses", lazy="noload")
    lecturers: Mapped[list["CourseLecturer"]] = relationship("CourseLecturer", back_populates="course", lazy="noload")
    students: Mapped[list["CourseStudent"]] = relationship("CourseStudent", back_populates="course", lazy="noload")


class CourseLecturer(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    lecturer_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("lecturer_profile.id")
    )

    course_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("course.id")
    )

    status: Mapped[str] = mapped_column(String(20))
    assigned_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    lecturer: Mapped["LecturerProfile"] = relationship("LecturerProfile", back_populates="courses", lazy="noload")
    course: Mapped["Course"] = relationship("Course", back_populates="lecturers", lazy="noload")


class CourseStudent(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    student_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("student_profile.id")
    )

    course_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("course.id")
    )

    semester: Mapped[str] = mapped_column(String(20))
    session: Mapped[str] = mapped_column(String(20))
    registered_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    student: Mapped["StudentProfile"] = relationship("StudentProfile", back_populates="courses", lazy="noload")
    course: Mapped["Course"] = relationship("Course", back_populates="students", lazy="noload")
