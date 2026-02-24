import logging

from app.api.course.dependencies import CourseServiceDep
from app.api.course.models import CourseStudent
from app.api.course.schema import AttendanceCreate, AttendanceOut, ClassSessionCreate, ClassSessionDetailed, ClassSessionOut, CourseCreate, CourseLecturerCreate, CourseLecturerOut, CourseOfferingCreate, CourseOfferingCreateReq, CourseOfferingLecturerOut, CourseOfferingOut, CourseOfferingOutDetailed, CourseOfferingOutLecturer, CourseOfferingOutMain, CourseOfferingOutStudent, CourseOut, CourseStudentCreate, CourseStudentOut, EventStatus, MessageCreate, MessageOut, StudentMessageOut, TaskCreate, TaskOut, TaskStudentFlat, TaskStudentOut, TaskStudentStatus, TaskStudentStatusExtended
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import ORJSONResponse
from pydantic import UUID4




logger = logging.getLogger(__name__)

course_router = APIRouter(prefix="/course", tags=["Course"])

@course_router.post(
    "/",
    status_code=status.HTTP_201_CREATED, summary="Create a new course",
    tags=["Admin", "HOD"]
)
async def create_course(
    course_data: CourseCreate,
    course_service: CourseServiceDep
) -> CourseOut:
    res = await course_service.create_course(course_data)
    return res


@course_router.get("/")
async def get_courses(
    course_service: CourseServiceDep
) -> list[CourseOut]:
    courses = await course_service.get_courses()
    return courses

@course_router.post(
    "/offering",
    status_code=status.HTTP_201_CREATED, summary="Create a new course offering",
    tags=["HOD"]
)
async def create_course_offering_for_a_session(
    course_offering_data: CourseOfferingCreateReq,
    course_service: CourseServiceDep
) -> CourseOfferingOut:
    res = await course_service.create_course_offering(course_offering_data)
    return res


@course_router.get("/offerings")
async def get_available_course_for_a_session(
    course_service: CourseServiceDep,
    session_id: UUID4,
    semester_id: UUID4 | None = None,
    is_active: bool | None = None,
    limit: int | None = None,
    skip: int | None = None,
) -> list[CourseOfferingOutDetailed]:
    offerings = await course_service.get_sesion_course_offerings(
        semester_id, session_id, is_active, skip=skip, limit=limit
    )
    return offerings


@course_router.get("/{course_id}")
async def get_course(
    course_id: UUID4,
    course_service: CourseServiceDep,
) -> CourseOut:
    course = await course_service.get_course(course_id)
    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )
    return course


@course_router.get("/current_session/available")
async def get_available_course_for_the_current_semester(
    course_service: CourseServiceDep,
    limit: int | None = None,
    skip: int | None = None,
) -> list[CourseOfferingOutDetailed]:
    offerings = await course_service.get_sesion_course_offerings(
        skip=skip, limit=limit
    )
    return offerings


@course_router.get("/offerings/{offering_id}")
async def get_course_offering(
    offering_id: UUID4,
    course_service: CourseServiceDep,
) -> CourseOfferingLecturerOut:
    offering = await course_service.get_course_offering(offering_id)
    if not offering:
        raise HTTPException(
            status_code=404,
            detail="Course offering not found"
        )
    return offering


# register for a course
@course_router.post(
    "/student/register",
    tags=["Student"],
)
async def register_for_a_course(
    course_offering_id: UUID4,
    student_id: UUID4,
    course_service: CourseServiceDep,
) -> CourseStudentOut:
    offering = await course_service.register_course_student(
        CourseStudentCreate(
            course_offering_id=course_offering_id,
            student_id=student_id,
        )
    )
    if not offering:
        raise HTTPException(
            status_code=404,
            detail="Course offering not found"
        )
    return offering


@course_router.get(
    "/student/tasks",
    tags=["Student"],
)
async def get_students_tasks(
    course_service: CourseServiceDep,
    student_id: UUID4,
    course_offering_id: UUID4 | None = None,
    status: TaskStudentStatusExtended | None = None,
    skip: int | None = None, limit: int | None = None
) -> list[TaskStudentFlat]:
    return await course_service.get_student_tasks(
        student_id, course_offering_id, status, skip, limit
    )



# Assigne a course to a lecturer
@course_router.post(
    "/lecturer/assign",
    tags=["HOD"]
)
async def assign_course_to_lecturer(
    course_service: CourseServiceDep,
    assign_obj: CourseLecturerCreate,
) -> CourseLecturerOut:
    return await course_service.assign_course_lecturer(
        assign_obj
    )


# get lecturer assigned courses
@course_router.get("/lecturer/courses")
async def get_lecturer_assigned_courses(
    course_service: CourseServiceDep,
    lecturer_id: UUID4,
) -> list[CourseOfferingOutLecturer]:
    return await course_service.get_lecturer_courses(
        lecturer_id
    )


@course_router.get(
    "/offering/tasks",
)
async def get_course_offering_tasks(
    course_service: CourseServiceDep,
    course_offering_id: UUID4,
    status: EventStatus | None = None,
    skip: int | None = None, limit: int | None = None
) -> list[TaskOut]:
    return await course_service.get_course_offering_tasks(
        course_offering_id, status, skip, limit
    )


@course_router.post(
    "/offering/task",
    tags=["Lecturer"]
)
async def create_a_task_for_a_course_offering(
    task_data: TaskCreate,
    course_service: CourseServiceDep,
) -> TaskOut:
    return await course_service.create_task(task_data)


@course_router.patch(
    "/offering/task/grade",
    tags=["Lecturer"]
)
async def grade_student_completed_task(
    task_id: UUID4,
    student_id: UUID4,
    grade: int,
    course_service: CourseServiceDep,
    lecturer_id: UUID4 | None = None,
) -> TaskStudentOut:
    return await course_service.grade_task(
        task_id=task_id,
        student_id=student_id,
        grade=grade,
        lecturer_id=lecturer_id,
    )


@course_router.get(
    "/student/offerings",
    tags=["Student"]
)
async def get_student_registered_courses(
    course_service: CourseServiceDep,
    student_id: UUID4,
) -> list[CourseOfferingOutStudent]:
    return await course_service.get_student_courses(student_id)



# get all department courses and their lecturer
@course_router.get(
    "/offerings/department",
    tags=["HOD"]
)
async def get_department_courses(
    course_service: CourseServiceDep,
    department_id: UUID4,
    session_id: UUID4 | None = None,
    skip: int | None = None,
    limit: int | None = None,
) -> list[CourseOfferingOutMain]:
    return await course_service.get_course_general(
        session_id=session_id,
        department_id=department_id,
        skip=skip,
        limit=limit
    )


# student complete task
@course_router.post(
    "/student/task/complete",
    tags=["Student"],
)
async def complete_task_for_a_student(
    student_id: UUID4,
    task_id: UUID4,
    course_service: CourseServiceDep,
    late: bool = False,
) -> TaskStudentOut:
    return await course_service.student_complete_task(
        student_id=student_id,
        task_id=task_id,
        late=late
    )


@course_router.post(
    "/class_session/attendance",
    tags=["Student", "Lecturer", "HOD"]
)
async def mark_attendance(
    attendance_obj: AttendanceCreate,
    course_service: CourseServiceDep,
) -> AttendanceOut:
    return await course_service.mark_attendance(attendance_obj)


@course_router.get(
    "/class_sessions/attendance",
    tags=["Student", "Lecturer", "HOD"]
)
async def get_attendance(
    course_service: CourseServiceDep,
    class_session_id: UUID4,
    skip: int | None = None,
    limit: int | None = None,
) -> list[AttendanceOut]:
    return await course_service.get_attendance(
        class_session_id, skip, limit
    )

@course_router.post(
    "/class_session",
    tags=["Student", "Lecturer", "HOD"]
)
async def create_class_session(
    class_session_data: ClassSessionCreate,
    course_service: CourseServiceDep,
) -> ClassSessionOut:
    return await course_service.create_class_session(class_session_data)

@course_router.get(
    "/class_session/{class_session_id}",
    tags=["Student", "Lecturer", "HOD"]
)
async def get_class_session(
    course_service: CourseServiceDep,
    class_session_id: UUID4,
) -> ClassSessionDetailed:
    return await course_service.get_class_session(class_session_id)


@course_router.get(
    "/offering/{offering_id}/class_sessions",
    tags=["Student", "Lecturer", "HOD"]
)
async def get_class_sessions(
    course_service: CourseServiceDep,
    course_offering_id: UUID4,
    detailed: bool = False,
    skip: int | None = None,
    limit: int | None = None,
) -> list[ClassSessionOut] | list[ClassSessionDetailed]:
    return await course_service.get_class_sessions(
        course_offering_id, detailed, skip, limit
    )


@course_router.post(
    "lecturer/announcement",
    tags=["Lecturer"]
)
async def create_announcement(
    announcement_data: MessageCreate,
    course_service: CourseServiceDep,
) -> MessageOut:
    return await course_service.get_lecturer_create_announcement(
        announcement_data
    )

@course_router.get(
    "/lecturer/announcement",
    tags=["Lecturer"]
)
async def get_announcement(
    course_service: CourseServiceDep,
    lecturer_id: UUID4,
    course_offering_id: UUID4 | None = None,
    skip: int | None = None,
    limit: int | None = None,
) -> list[MessageOut]:
    return await course_service.get_lecturer_announcement(
        lecturer_id, course_offering_id, skip, limit
    )


@course_router.get(
    "/announcement/student",
    tags=["Student"]
)
async def get_announcement(
    course_service: CourseServiceDep,
    student_id: UUID4,
    read: bool | None = None,
    course_offering_id: UUID4 | None = None,
    skip: int | None = None,
    limit: int | None = None,
) -> list[StudentMessageOut]:
    return await course_service.get_announcement_student(
        student_id, read, course_offering_id, skip, limit
    )

@course_router.post(
    "/announcement/student/mark",
    tags=["Student"]
)
async def mark_announcement(
    course_service: CourseServiceDep,
    student_id: UUID4,
    message_id: UUID4,
    read: bool = True,
) -> ORJSONResponse:
    updated = await course_service.student_mark_announcement_read(
        student_id, message_id, read
    )
    if not updated:
        raise HTTPException(
            status_code=404,
            detail=f"Unable to mark message as {'read' if read else 'unread'}"
        )
    return ORJSONResponse(
        {"message" : f"Message successfully marked as {'read' if read else 'unread'}"},
        status_code=200,
    )
