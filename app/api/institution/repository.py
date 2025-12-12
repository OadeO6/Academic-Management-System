from pydantic import UUID4
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.common.repo import BaseRepo
from app.api.institution.models import Department, Faculty, School
from app.api.institution.schema import DepartmentCreate, DepartmentUpdate, FacultyCreate, FacultyUpdate, SchoolCreate, SchoolUpdate


class SchoolRepo(BaseRepo[School, SchoolCreate, SchoolUpdate]):
    pass


class FacultyRepo(BaseRepo[Faculty, FacultyCreate, FacultyUpdate]):
    async def get_faculties(
            self, con: AsyncSession, school_id: UUID4 | None = None
    ) -> list[Faculty]:
        if school_id is None:
            faculties = await self.get_all(con)
        else:
            faculties = await self.get_all(
                con, filter={self.model.school_id: school_id}
            )
        return faculties


class DepartmentRepo(BaseRepo[Department, DepartmentCreate, DepartmentUpdate]):
    async def get_departments(
            self, con: AsyncSession, faculty_id: UUID4 | None = None
    ) -> list[Department]:
        if faculty_id is None:
            departments = await self.get_all(con)
        else:
            departments = await self.get_all(
                con, filter={self.model.faculty_id: faculty_id}
            )
        return departments
