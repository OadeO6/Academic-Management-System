from pydantic import UUID4, BaseModel, ConfigDict


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
    name: str
    faculty_id: UUID4

    model_config = ConfigDict(from_attributes=True)


class DepartmentOutDetailed(DepartmentOut):
    # users: list[UserOut]
    # courses: list[CourseOut]

    model_config = ConfigDict(from_attributes=True)


class FacultyOut(BaseModel):
    id: UUID4
    name: str

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
