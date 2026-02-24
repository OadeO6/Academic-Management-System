from datetime import datetime
from enum import StrEnum
from pydantic import UUID4, BaseModel, EmailStr

from app.api.course.schema import CourseOfferingOut, CourseOfferingOutDetailed, CourseOfferingOutLecturer, CourseOfferingOutStudent, TaskStudentFlat


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


class _UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    department_id: UUID4


class UserCreate(_UserCreate):
    user_type: UserType

class StudentCreateReq(_UserCreate):
    matric_number: str
    admission_session_id: UUID4
    status: Status = Status.ACTIVE

class StudentCreate(StudentCreateReq):
    user_type: UserType = UserType.STUDENT


class StudentProfileOut(BaseModel):
    id: UUID4
    matric_number: str
    admission_session_id: UUID4
    status: Status

class StudentDetailsOut(BaseModel):
    id: UUID4
    matric_number: str
    admission_session_id: UUID4
    status: Status
    user_id: UUID4
    first_name: str
    last_name: str
    email: EmailStr
    department_id: UUID4
    department: str
    course_offerings: list[CourseOfferingOutDetailed]

class StudentUpdate(BaseModel):
    pass

class LecturerCreateReq(_UserCreate):
    rank: LecturerRank
    title: LecturerTitle
    degree: LecturerDegree

class LecturerCreate(LecturerCreateReq):
    user_type: UserType = UserType.LECTURER
    status: Status = Status.ACTIVE


class LecturerUpdate(BaseModel):
    pass


class LecturerDashboardSummary(BaseModel):
    total_course: int
    total_lectures_completed: int
    courses: list[CourseOfferingOutLecturer]
    # lectuers_this_week: int

class LecturerProfileOut(BaseModel):
    id: UUID4
    user_id: UUID4
    rank: LecturerRank
    title: LecturerTitle
    degree: LecturerDegree
    status: Status


class UserLecturerProfile(LecturerProfileOut):
    first_name: str
    last_name: str
    email: EmailStr


class LecturerDetailsOut(UserLecturerProfile):
    course_offerings: list[CourseOfferingOutDetailed]
    department: str
    department_id: UUID4


class StudentDashboardSummary(BaseModel):
    total_course_offering: int
    total_lectures_completed: int
    pending_assignments: int
    courses: list[CourseOfferingOutStudent]
    # lectuers_this_week: int


class StudentTaskSummary(BaseModel):
    total_tasks: int
    total_pending_tasks: int
    total_completed_tasks: int
    tasks: list[TaskStudentFlat]


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


class UserDetailedOut(UserOut):
    student_profile: StudentProfileOut | None = None
    lecturer_profile: LecturerProfileOut | None = None



class UserRes(BaseModel):
    data: UserOut
    count: int
