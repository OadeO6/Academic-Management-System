from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.log import logging
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.common.models import Base
from ..api.user.models import *
from ..api.institution.models import *
from ..api.course.models import *

from ..core.config import settings

logger = logging.getLogger(__name__)

engine = create_async_engine(
    url=settings.ASYNC_POSTGRES_URL, echo=settings.DEBUG
)

SessionLocal = async_sessionmaker(
    bind=engine, autocommit=False, expire_on_commit=False
)


async def get_session() -> AsyncSession:
    """Get database connection"""
    async with SessionLocal() as session:
        yield session


async def check_db_health() -> bool:
    """Check if database connection is healthy"""
    # session = await get_session()
    try:
        logger.info("Trying to connect to database")
        async with get_session() as session:
            await session.execute("SELECT 1")
    except Exception:
        logger.error("Unnable to connect to database")
        return False
    logger.info("Successfully connected to database")
    return True


async def init_db():
    """Initialize database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

