from typing import Annotated

from app.api.course.models import Attendance, ClassSession, Course, CourseLecturer, CourseOffering, CourseStudent, Message, Task, TaskStudent
from app.api.course.repository import AttendanceRepo, ClassSessionRepo, CourseLecturerRepo, CourseOfferingRepo, CourseRepo, CourseStudentRepo, MessageRepo, TaskRepo, TaskStudentRepo
from fastapi import Depends


async def get_course_repo():
    course_repo = CourseRepo(Course)
    return course_repo


async def get_course_student_repo():
    course_student_repo = CourseStudentRepo(CourseStudent)
    return course_student_repo


async def get_course_lecturer_repo():
    course_lecturer_repo = CourseLecturerRepo(CourseLecturer)
    return course_lecturer_repo


async def get_course_offering_repo():
    course_offering_repo = CourseOfferingRepo(CourseOffering)
    return course_offering_repo


async def get_task_repo():
    task_repo = TaskRepo(Task)
    return task_repo


async def get_message_repo():
    message_repo = MessageRepo(Message)
    return message_repo


async def get_class_session_repo():
    class_session_repo = ClassSessionRepo(ClassSession)
    return class_session_repo

async def get_attendance_repo():
    attendance_repo = AttendanceRepo(Attendance)
    return attendance_repo

from app.api.course.service import CourseService # noqa


CourseServiceDep = Annotated[CourseService, Depends()]
