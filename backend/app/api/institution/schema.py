from datetime import date
from enum import StrEnum
from pydantic import UUID4, BaseModel, ConfigDict, Field




class SemesterEnum(StrEnum):
    FIRST = "FIRST"
    SECOND = "SECOND"


class DepartmentCreate(BaseModel):
    name: str
    faculty_id: UUID4


class FacultyCreate(BaseModel):
    name: str
    school_id: UUID4


class SchoolCreate(BaseModel):
    name: str


class SchoolUpdate(BaseModel):
    pass


class DepartmentUpdate(BaseModel):
    pass


class FacultyUpdate(BaseModel):
    pass


class DepartmentOut(BaseModel):
    id: UUID4
    name: str = Field(..., example="Mechanical Engineering")
    faculty_id: UUID4

    model_config = ConfigDict(from_attributes=True)


class DepartmentOutDetailed(DepartmentOut):
    # users: list[UserOut]
    # courses: list[CourseOut]

    model_config = ConfigDict(from_attributes=True)


class FacultyOut(BaseModel):
    id: UUID4
    name: str = Field(..., example="Engineering")

    school_id: UUID4
    departments: list[DepartmentOut] = []

    model_config = ConfigDict(from_attributes=True)


class FacultyOutDetailed(FacultyOut):
    departments: list[DepartmentOutDetailed] = []  # noqa # pylint: disable=W0622

    model_config = ConfigDict(from_attributes=True)


class SchoolOut(BaseModel):
    id: UUID4
    name: str

    model_config = ConfigDict(from_attributes=True)


class SchoolOutDetailed(SchoolOut):
    faculties: list[FacultyOutDetailed] = []

    model_config = ConfigDict(from_attributes=True)


class _SessionCreate(BaseModel):
    name: str
    school_id: UUID4


class SessionCreate(_SessionCreate):
    start_date: date
    end_date: date | None = None
    is_active: bool = True


class SessionUpdate(BaseModel):
    pass


class SessionOut(BaseModel):
    id: UUID4
    name: str = Field(..., example="2023-2024")
    school_id: UUID4
    start_date: date
    end_date: date | None = None
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


class SessionOutDetailed(SessionOut):
    course_offerings: list["CourseOfferingOut"] = []
    semesters: list["SemesterOut"] = []

    model_config = ConfigDict(from_attributes=True)


class SemesterCreate(BaseModel):
    session_id: UUID4
    name: SemesterEnum
    start_date: date
    end_date: date | None = None
    is_active: bool = True

class SemesterUpdate(BaseModel):
    pass


class SemesterOut(BaseModel):
    id: UUID4
    session_id: UUID4
    name: SemesterEnum
    start_date: date
    end_date: date | None = None
    is_active: bool = True


class SemesterAndSessionCreate(_SessionCreate):
    first_semester_start_date: date
    first_semester_end_date: date
    second_semester_start_date: date
    second_semester_end_date: date
