from uuid import UUID as _UUID, uuid4

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from ..common.models import Base


class School(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(255), unique=True)

    # Relationships
    faculties: Mapped[list["Faculty"]] = relationship("Faculty", back_populates="school", lazy="noload")

    model_config = {"from_attributes": True}



class Faculty(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(255), unique=True)

    school_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("school.id"))

    school: Mapped["School"] = relationship("School", back_populates="faculties", lazy="noload")
    departments: Mapped[list["Department"]] = relationship("Department", back_populates="faculty", lazy="noload")

    model_config = {"from_attributes": True}


class Department(Base):
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(255))

    faculty_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("faculty.id"))

    faculty: Mapped["Faculty"] = relationship("Faculty", back_populates="departments", lazy="noload")
    users: Mapped[list["User"]] = relationship("User", back_populates="department", lazy="noload")
    courses: Mapped[list["Course"]] = relationship("Course", back_populates="department", lazy="noload")

    model_config = {"from_attributes": True}
