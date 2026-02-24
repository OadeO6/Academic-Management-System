from datetime import date
from typing import Annotated, Type, TypeVar
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy.orm import Session

from fastapi import Depends

from app.api.institution.dependencies import (
    get_school_repo, get_faculty_repo, get_department_repo, get_semester_repo, get_session_repo
)
from app.api.institution.models import Department, Faculty, School
from app.api.institution.repository import (
    SchoolRepo, FacultyRepo, DepartmentRepo, SemesterRepo, SessionRepo
)
from app.api.institution.schema import (
    DepartmentCreate, FacultyCreate, SchoolCreate, SchoolOut, SemesterAndSessionCreate, SemesterCreate, SemesterEnum, SessionCreate
)
from app.api.common.dependencies import DbCon


T = TypeVar("T", bound=BaseModel)

class InstitutionService:
    def __init__(
        self,
        session: DbCon,
        school_repo: Annotated[SchoolRepo, Depends(get_school_repo)],
        faculty_repo: Annotated[FacultyRepo, Depends(get_faculty_repo)],
        session_repo: Annotated[SessionRepo, Depends(get_session_repo)],
        semester_repo: Annotated[SemesterRepo, Depends(get_semester_repo)],
        department_repo: Annotated[
            DepartmentRepo, Depends(get_department_repo)
        ]
    ):
        self.school_repo = school_repo
        self.faculty_repo = faculty_repo
        self.department_repo = department_repo
        self.session_repo = session_repo
        self.semester_repo = semester_repo
        self.session = session

    # School
    async def create_school(self, school_data: SchoolCreate) -> School:
        async with self.session.begin():
            school = await self.school_repo.create_one(
                self.session, school_data
            )
            return school


    async def get_school(
        self, id: UUID, schema: Type[T] = SchoolOut,
    ) -> T | None:
        async with self.session.begin():
            school = await self.school_repo.get_one_by_id(
                self.session, id, depth=2
            )
            if not school:
                return None
            return school

    async def get_schools(self) -> list[School]:
        async with self.session.begin():
            schools = await self.school_repo.get_all(self.session)
            return schools

    # Faculty
    async def create_faculty(self, faculty_data: FacultyCreate) -> Faculty:
        async with self.session.begin():
            faculty = await self.faculty_repo.create_one(
                self.session, faculty_data
            )
            return faculty

    async def get_faculty(self, id: UUID) -> Faculty | None:
        faculty = await self.faculty_repo.get_one_by_id(
            self.session, id, depth=2
        )
        return faculty

    async def get_faculties(
            self, school_id: UUID | None = None
    ) -> list[Faculty]:
        async with self.session.begin():
            faculties = await self.faculty_repo.get_faculties(
                self.session, school_id=school_id
            )
            return faculties

    # Department
    async def create_department(
            self, department_data: DepartmentCreate
    ) -> Department:
        async with self.session.begin():
            department = await self.department_repo.create_one(
                self.session, department_data
            )
            return department

    async def get_department(self, id: UUID) -> Department | None:
        async with self.session.begin():
            department = await self.department_repo.get_one_by_id(
                self.session, id, depth=2
            )
            return department

    async def get_departments(
            self, faculty_id: UUID | None = None,
            school_id: UUID | None = None,
            skip: int | None = None,
            limit: int | None = None
    ) -> list[Department]:
        async with self.session.begin():
            departments = await self.department_repo.get_departments(
                self.session, faculty_id=faculty_id, school_id=school_id,
                skip=skip, limit=limit
            )
            return departments

    # Session
    async def create_session(self, session_data: SemesterAndSessionCreate) -> Session:
        async with self.session.begin():
            session_only = SessionCreate(
                **session_data.dict(exclude_unset=True),
                start_date=session_data.first_semester_start_date,
                end_date=session_data.second_semester_end_date,
                is_active=True if session_data.first_semester_start_date >= date.today() and session_data.second_semester_end_date <= date.today() else False,
            )
            print(session_only, "bug")
            session = await self.session_repo.create_one(
                self.session, session_only
            )
            first_semester_data = SemesterCreate(
                session_id=session.id,
                name=SemesterEnum.FIRST,
                start_date=session_data.first_semester_start_date,
                end_date=session_data.first_semester_end_date,
                is_active=True if session_data.first_semester_start_date >= date.today() and session_data.first_semester_end_date <= date.today() else False,
            )
            second_semester_data = SemesterCreate(
                session_id=session.id,
                name=SemesterEnum.SECOND,
                start_date=session_data.second_semester_start_date,
                end_date=session_data.second_semester_end_date,
                is_active=True if session_data.second_semester_start_date >= date.today() and session_data.second_semester_end_date <= date.today() else False,
            )
            await self.semester_repo.create_multiple(
                self.session, [first_semester_data, second_semester_data]
            )
            return session

    async def get_session(self, id: UUID) -> Session | None:
        session = await self.session_repo.get_one_by_id(
            self.session, id, depth=1
        )
        return session

    async def get_sessions(
        self,
        skip: int | None = None, limit: int | None = None
    ) -> list[Session]:
        sessions = await self.session_repo.get_all(
            self.session,
            skip=skip, limit=limit
        )
        return sessions
