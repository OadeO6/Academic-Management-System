from typing import Annotated

from app.api.institution.models import Department, Faculty, School, Semester, Session
from app.api.institution.repository import DepartmentRepo, FacultyRepo, SchoolRepo, SemesterRepo, SessionRepo
from fastapi import Depends


async def get_school_repo():
    school_repo = SchoolRepo(School)
    return school_repo


async def get_faculty_repo():
    faculty_repo = FacultyRepo(Faculty)
    return faculty_repo


async def get_department_repo():
    department_repo = DepartmentRepo(Department)
    return department_repo

async def get_session_repo():
    session_repo = SessionRepo(Session)
    return session_repo

async def get_semester_repo():
    semester_repo = SemesterRepo(Semester)
    return semester_repo

from app.api.institution.service import InstitutionService  # noqa


InstitutionServiceDep = Annotated[InstitutionService, Depends()]
