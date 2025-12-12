from uuid import UUID as _UUID, uuid4
from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Integer, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.api.user.schema import LecturerDegree, LecturerRank, LecturerTitle, Status, UserType
from ..common.models import Base


class User(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=True)

    password: Mapped[str] = mapped_column(String(255))
    user_type: Mapped[UserType] = mapped_column(
        Enum(UserType, name="user_type", create_type=True)
    )

    department_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("department.id"), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc)
    )

    department: Mapped["Department"] = relationship("Department", back_populates="users", lazy="noload")
    student_profile: Mapped["StudentProfile"] = relationship("StudentProfile", back_populates="user", uselist=False, lazy="noload")
    lecturer_profile: Mapped["LecturerProfile"] = relationship("LecturerProfile", back_populates="user", uselist=False, lazy="noload")


class StudentProfile(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user.id"),
        unique=True
    )

    matric_number: Mapped[str] = mapped_column(String(50), unique=True)
    year_of_admission: Mapped[int] = mapped_column(Integer)
    admission_session: Mapped[str] = mapped_column(String(20))
    status: Mapped[Status] = mapped_column(
        Enum(Status, name="status", create_type=True)
    )

    user: Mapped["User"] = relationship("User", back_populates="student_profile", lazy="noload")
    courses: Mapped[list["CourseStudent"]] = relationship("CourseStudent", back_populates="student", lazy="noload")


class LecturerProfile(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user.id"),
        unique=True
    )

    rank: Mapped[LecturerRank] = mapped_column(
        Enum(LecturerRank, name="rank", create_type=True)
    )
    title: Mapped[LecturerTitle] = mapped_column(
        Enum(LecturerTitle, name="title", create_type=True)
    )
    degree: Mapped[LecturerDegree] = mapped_column(
        Enum(LecturerDegree, name="degree", create_type=True)
    )
    status: Mapped[Status] = mapped_column(
        Enum(Status, name="status", create_type=True)
    )

    user: Mapped["User"] = relationship("User", back_populates="lecturer_profile", lazy="noload")
    courses: Mapped[list["CourseLecturer"]] = relationship("CourseLecturer", back_populates="lecturer", lazy="noload")
