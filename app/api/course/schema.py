from enum import StrEnum
from pydantic import UUID4, BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    pass


class UserOut(BaseModel):
    id: UUID4
    email: EmailStr


class UserType(StrEnum):
    STUDENT = "STUDENT"
    COURSE_REP = "COURSE_REP"
    LECTURER = "LECTURER"
    HOD = "HOD"
