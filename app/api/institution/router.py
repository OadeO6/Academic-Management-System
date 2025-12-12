import logging

from app.api.institution.dependencies import InstitutionServiceDep
from app.api.institution.schema import DepartmentCreate, FacultyCreate, FacultyOut, FacultyOutDetailed, SchoolCreate, SchoolOut, SchoolOutDetailed
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
    status_code=status.HTTP_201_CREATED, summary="Create a new school"
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
    status_code=status.HTTP_201_CREATED, summary="Create a new faculty"
)
async def create_faculty(
    faculty_data: FacultyCreate,
    institution_service: InstitutionServiceDep
) -> SchoolOut:
    res = await institution_service.create_faculty(faculty_data)
    return res


@institution_router.get("/faculties")
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
    status_code=status.HTTP_201_CREATED, summary="Create a new department"
)
async def create_department(
    department_data: DepartmentCreate,
    institution_service: InstitutionServiceDep
) -> SchoolOut:
    res = await institution_service.create_department(department_data)
    return res


@institution_router.get("/departments")
@institution_router.get("{faculty_id}/departments")
async def get_departments(
    institution_service: InstitutionServiceDep,
    faculty_id: UUID4 | None = None
) -> list[SchoolOut]:
    departments = await institution_service.get_departments(faculty_id)
    return departments


@institution_router.get("/departments/{department_id}")
async def get_department(
    department_id: UUID4,
    institution_service: InstitutionServiceDep,
) -> SchoolOutDetailed:
    department = await institution_service.get_department(department_id)
    if not department:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )
    return department
