from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db_con import get_session


DbCon = Annotated[AsyncSession, Depends(get_session)]
