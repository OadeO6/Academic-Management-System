import logging

from app.api.institution.dependencies import InstitutionServiceDep
from app.api.institution.schema import DepartmentCreate, DepartmentOut, FacultyCreate, FacultyOut, FacultyOutDetailed, SchoolCreate, SchoolOut, SchoolOutDetailed, SemesterAndSessionCreate, SessionOut, SessionOutDetailed
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import ORJSONResponse
from pydantic import UUID4

from app.api.user.dependencies import UserServiceDep
from app.api.user.schema import UserCreate, UserOut



logger = logging.getLogger(__name__)

institution_router = APIRouter(prefix="/institution", tags=["Institution"])


"""
======================================================================
School
======================================================================
"""


@institution_router.post(
    "/school",
    status_code=status.HTTP_201_CREATED, summary="Create a new school",
    tags=["Admin"]
)
async def create_school(
    school_data: SchoolCreate,
    institution_service: InstitutionServiceDep
) -> SchoolOut:
    res = await institution_service.create_school(school_data)
    return res


@institution_router.get("/schools")
async def get_schools(
        institution_service: InstitutionServiceDep
) -> list[SchoolOut]:
    schools = await institution_service.get_schools()
    return schools


@institution_router.get("/schools/{school_id}")
async def get_school(
    school_id: UUID4,
    institution_service: InstitutionServiceDep,
) -> SchoolOutDetailed:
    school = await institution_service.get_school(school_id, SchoolOutDetailed)
    if not school:
        raise HTTPException(
            status_code=404,
            detail="School not found"
        )
    return school


"""
======================================================================
Faculty
======================================================================
"""


@institution_router.post(
    "/faculty",
    status_code=status.HTTP_201_CREATED, summary="Create a new faculty",
    tags=["Admin"]
)
async def create_faculty(
    faculty_data: FacultyCreate,
    institution_service: InstitutionServiceDep
) -> SchoolOut:
    res = await institution_service.create_faculty(faculty_data)
    return res


@institution_router.get("/faculties")
async def get_faculties_(
    institution_service: InstitutionServiceDep,
) -> list[FacultyOut]:
    return await institution_service.get_faculties()


@institution_router.get("/{school_id}/faculties")
async def get_faculties(
    institution_service: InstitutionServiceDep,
    school_id: UUID4 | None = None
) -> list[FacultyOut]:
    faculties = await institution_service.get_faculties(school_id)
    return faculties


@institution_router.get("/faculties/{faculty_id}")
async def get_faculty(
    faculty_id: UUID4,
    institution_service: InstitutionServiceDep,
) -> FacultyOutDetailed:
    faculty = await institution_service.get_faculty(faculty_id)
    if not faculty:
        raise HTTPException(
            status_code=404,
            detail="Faculty not found"
        )
    return faculty


"""
======================================================================
Department
======================================================================
"""


@institution_router.post(
    "/department",
    status_code=status.HTTP_201_CREATED, summary="Create a new department",
    tags=["Admin"]
)
async def create_department(
    department_data: DepartmentCreate,
    institution_service: InstitutionServiceDep
) -> SchoolOut:
    res = await institution_service.create_department(department_data)
    return res


@institution_router.get("/departments")
async def get_departments_(
    institution_service: InstitutionServiceDep,
    school_id: UUID4 | None = None,
    faculty_id: UUID4 | None = None,
    skip: int | None = None,
    limit: int | None = None
) -> list[DepartmentOut]:
    return await institution_service.get_departments(
        faculty_id, school_id, skip=skip, limit=limit
    )


@institution_router.get("/departments/{department_id}")
async def get_department(
    department_id: UUID4,
    institution_service: InstitutionServiceDep,
) -> DepartmentOut:
    department = await institution_service.get_department(department_id)
    if not department:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )
    return department



"""
======================================================================
Session
======================================================================
"""

@institution_router.post(
    "/session",
    status_code=status.HTTP_201_CREATED, summary="Create a new session",
    tags=["Admin"]
)
async def create_session(
    session_data: SemesterAndSessionCreate,
    institution_service: InstitutionServiceDep
) -> SessionOut:
    res = await institution_service.create_session(session_data)
    return res

@institution_router.get("/session")
async def get_sessions(
    institution_service: InstitutionServiceDep,
    limit: int | None = None, skip: int | None = None
) -> list[SessionOut]:
    sessions = await institution_service.get_sessions(
        limit=limit, skip=skip
    )
    return sessions


@institution_router.get("/session/{session_id}")
async def get_session(
    session_id: UUID4,
    institution_service: InstitutionServiceDep,
) -> SessionOutDetailed:
    session = await institution_service.get_session(session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )
    return session
