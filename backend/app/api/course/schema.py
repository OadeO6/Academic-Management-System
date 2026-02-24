from datetime import datetime
from enum import Enum, StrEnum
from pydantic import UUID4, BaseModel, ConfigDict, EmailStr

from app.api.institution.schema import SemesterEnum


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


class ClassSessionStatus(StrEnum):
    COMPLETED = "COMPLETED"
    ONGOING = "ONGOING"
    UPCOMING = "UPCOMING"
    UNKNOWN = "UNKNOWN"


class EventStatus(StrEnum):
    UPCOMING = "UPCOMING"
    ONGOING = "ONGOING"
    CONCLUDED = "CONCLUDED"
    CANCELLED = "CANCELLED"
    UNKNOWN = "UNKNOWN"


class TaskType(StrEnum):
    ASSIGNMENT = "ASSIGNMENT"
    PROJECT = "PROJECT"
    ACTION = "ACTION"


class TaskStudentStatus(StrEnum):
    COMPLETED = "COMPLETED"
    PENDING = "PENDING"
    COMPLETED_LATE = "COMPLETED_LATE"
    UNKNOWN = "UNKNOWN"


class TaskStudentStatusExtended(StrEnum):
    GRADED = "GRADED"
    COMPLETED = "COMPLETED"
    PENDING = "PENDING"
    COMPLETED_LATE = "COMPLETED_LATE"
    UNKNOWN = "UNKNOWN"


class AttendanceStatus(StrEnum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    EXCUSED = "EXCUSED"


class TaskCreate(BaseModel):
    course_offering_id: UUID4
    task_type: TaskType
    lecturer_id: UUID4
    title: str
    details: str
    deadline: datetime | None = None


class TaskUpdate(BaseModel):
    pass


class TaskOut(BaseModel):
    id: UUID4
    course_offering_id: UUID4
    task_type: TaskType
    lecturer_id: UUID4
    title: str
    details: str
    deadline: datetime | None = None
    created_at: datetime


class TaskStudentCreate(BaseModel):
    task_id: UUID4
    student_id: UUID4
    status: TaskStudentStatus


class TaskStudentUpdate(BaseModel):
    pass


class TaskStudentOut(BaseModel):
    id: UUID4
    task_id: UUID4
    student_id: UUID4
    task_status: EventStatus
    grade: int | None = None
    status: TaskStudentStatus


class TaskStudentFlat(BaseModel):
    task_id: UUID4
    course_offering_id: UUID4
    lecturer_id: UUID4
    title: str
    details: str
    deadline: datetime | None = None
    created_at: datetime
    task_status: EventStatus
    grade: int | None = None
    task_student_status: TaskStudentStatus


class CourseCreate(BaseModel):
    name: str
    code: str
    overview: str | None = None
    level: int
    department_id: UUID4


class CourseUpdate(BaseModel):
    pass


class CourseOut(BaseModel):
    id: UUID4
    name: str
    code: str
    overview: str | None = None
    level: int
    department_id: UUID4


class CourseOfferingCreateReq(BaseModel):
    course_id: UUID4
    semester_id: UUID4
    is_active: bool = True


class CourseOfferingCreate(BaseModel):
    course_id: UUID4
    semester_id: UUID4
    session_id: UUID4
    is_active: bool = True


class CourseOfferingUpdate(BaseModel):
    pass


class CourseOfferingOut(CourseOfferingCreate):
    id: UUID4
    class_completed: int


class CourseOfferingLecturerOut(CourseOfferingOut):
    course_lecturers: list["LecturerProfileOut"]


class CourseOfferingOutDetailed(CourseOfferingOut):
    semester: SemesterEnum
    course_code: str
    course_name: str


class CourseOfferingOutMain(BaseModel):
    course_offering_id: UUID4
    semester_id: UUID4
    session_id: UUID4
    course_code: str
    course_name: str
    total_class_session: int
    session: str
    semester: SemesterEnum
    course_lecturers: list["UserLecturerProfile"]
    # student_registered: bool = False




class CourseOfferingOutLecturer(CourseOfferingOutMain):
    lecture_completed: int
    assigned_at: datetime



class CourseOfferingOutStudent(CourseOfferingOutMain):
    class_session_attended: int
    pending_tasks: list[TaskOut]


class CourseStudentCreate(BaseModel):
    student_id: UUID4
    course_offering_id: UUID4


class CourseStudentUpdate(BaseModel):
    pass


class CourseStudentOut(CourseStudentCreate):
    course_offering_id: UUID4
    class_completed: int
    registered_at: datetime


class CourseLecturerCreate(BaseModel):
    lecturer_id: UUID4
    course_offering_id: UUID4


class CourseLecturerOut(CourseLecturerCreate):
    lecturer_id: UUID4
    course_offering_id: UUID4
    assigned_at: datetime
    status: str | None = None
    class_completed: int


class StudentClassSessionStat(BaseModel):
    student_id: UUID4
    class_session_id: UUID4
    attended: bool = False
    marked_at: datetime | None = None
    class_session_time: datetime | None = None


class CourseLecturerUpdate(BaseModel):
    pass


class MessageCreate(BaseModel):
    course_offering_id: UUID4
    lecturer_id: UUID4
    title: str
    details: str


class MessageUpdate(BaseModel):
    pass


class MessageOut(BaseModel):
    id: UUID4
    course_offering_id: UUID4
    lecturer_id: UUID4
    title: str
    details: str
    created_at: datetime
    updated_at: datetime


class StudentMessageOut(MessageOut):
    read: bool = False

class AttendanceCreate(BaseModel):
    class_session_id: UUID4
    student_id: UUID4
    status: AttendanceStatus


class AttendanceUpdate(BaseModel):
    pass


class AttendanceOut(AttendanceCreate):
    id: UUID4
    marked_at: datetime
    status: AttendanceStatus


class ClassSessionCreate(BaseModel):
    course_offering_id: UUID4
    lecturer_id: UUID4
    status: ClassSessionStatus | None = None
    start: datetime
    end: datetime | None = None


class ClassSessionUpdate(BaseModel):
    pass


class ClassSessionOut(ClassSessionCreate):
    id: UUID4

    model_config = ConfigDict(from_attributes=True)


class ClassSessionDetailed(ClassSessionOut):
    attendance: list[AttendanceOut]

    model_config = ConfigDict(from_attributes=True)
