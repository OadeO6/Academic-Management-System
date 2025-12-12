from datetime import datetime
from enum import StrEnum
from pydantic import UUID4, BaseModel, EmailStr


class Status(StrEnum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class UserType(StrEnum):
    STUDENT = "STUDENT"
    COURSE_REP = "COURSE_REP"
    LECTURER = "LECTURER"
    HOD = "HOD"


class LecturerRank(StrEnum):
    GRADUATE_ASSISTANT = "GRADUATE_ASSISTANT"
    ASSISTANT_LECTURER = "ASSISTANT_LECTURER"
    LECTURER_II = "LECTURER_2"
    LECTURER_I = "LECTURER_1"
    SENIOR_LECTURER = "SENIOR_LECTURER"
    ASSOCIATE_PROFESSOR = "ASSOCIATE_PROFESSOR"
    PROFESSOR = "PROFESSOR"


class LecturerTitle(StrEnum):
    MR = "MR"
    MRS = "MRS"
    DR = "DR"
    ENGR = "ENGR"
    ARC = "ARC"
    BARR = "BARR"
    PROF = "PROF"


class LecturerDegree(StrEnum):
    BACHELOR = "BACHELOR"
    MASTER = "MASTER"
    PHD = "PHD"


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    user_type: UserType
    department_id: UUID4


class StudentCreate(UserCreate):
    matric_number: str
    year_of_admission: int
    admission_session: str
    status: Status = Status.ACTIVE


class LecturerCreate(UserCreate):
    rank: LecturerRank
    title: LecturerTitle
    degree: LecturerDegree
    status: Status = Status.ACTIVE


class UserUpdate(BaseModel):
    pass

class UserOut(BaseModel):
    id: UUID4
    email: EmailStr
    first_name: str
    last_name: str
    user_type: UserType
    department_id: UUID4
    created_at: datetime
    updated_at: datetime

class UserRes(BaseModel):
    data: UserOut
    count: int
