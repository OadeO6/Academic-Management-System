import asyncio
from time import time
import logging
from contextlib import asynccontextmanager

from app.api.common.schema import rebuild_schema
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.openapi.utils import get_openapi
from asgi_correlation_id import CorrelationIdMiddleware


from app.api.common.models import Base
from app.exceptions import CustomError
from app.api.common.utils import use_redis
from app.core.db_con import check_db_health, init_db

from .user.router import user_router
from .institution.router import institution_router
from .course.router import course_router
from ..core.redis_con import RedisConnectionError, close_redis_pool, connect_redis_pool
from ..core.logger import setup_logging
from ..core.config import settings

# Configure logging right at the start
setup_logging()

# Get the logger for this module
logger = logging.getLogger(__name__)


# --- Add the Request Logging Middleware ---
# class LogRequestBodyMiddleware(BaseHTTPMiddleware):
#     async def dispatch(self, request: Request, call_next):
#         body = await request.body()
#         logger.info(f"Request: {request.method} {request.url} | Headers: {request.headers} | Body: {body.decode()}")
#         response = await call_next(request)
#         return response


@asynccontextmanager
async def lifespan_event_handler(app: FastAPI):
    logger.info("Service startup sequence initiated.")

    try:
        # Create DB scehams

        await init_db()


        # --- CONNECT TO REDIS ON STARTUP ---
        if use_redis():
            await connect_redis_pool()

        yield

    except RedisConnectionError as e:
        logger.critical(f"🔴 Startup failed: Redis connection error: {e}", exc_info=True)
        raise
    except Exception as e:
        logger.critical(f"🔴 An unexpected error occurred during startup: {e}", exc_info=True)
        raise
    finally:
        logger.info("Service shutdown sequence initiated.")

        # --- CLOSE REDIS POOL ON SHUTDOWN ---
        if use_redis():
            await close_redis_pool()

        logger.info("Shutdown sequence complete.")


app = FastAPI(
    version="1.0",
    lifespan=lifespan_event_handler
)

# security_scheme = HTTPBearer()
#
# original_openapi = app.openapi



def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="My API",
        version="1.0.0",
        description="API description",
        routes=app.routes,
    )

    # if "components" not in openapi_schema:
    #     openapi_schema["components"] = {}
    #
    # if "securitySchemes" not in openapi_schema["components"]:
    #     openapi_schema["components"]["securitySchemes"] = {}
    #
    # openapi_schema["components"]["securitySchemes"]["BearerAuth"] = {
    #     "type": "http",
    #     "scheme": "bearer",
    #     "bearerFormat": "JWT",
    # }
    #
    # openapi_schema["security"] = [{"BearerAuth": []}]
    #
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start_time = time()
        response = await call_next(request)
        process_time = time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response


app.add_middleware(CorrelationIdMiddleware)
app.add_middleware(TimingMiddleware)



@app.exception_handler(CustomError)
async def custom_global_exception_handler(_: Request, exc: CustomError):
    error =  exc.name if exc.name else "Internal Server Error"
    logger.error(f"Custon exception {error}", exc_info=exc)

    return JSONResponse(
        status_code=exc.code if exc.code else 500,
        content={
            "status_code": exc.code or 500,
            "error": exc.message
            # "detail": str(exc)
        },
    )



@app.exception_handler(Exception)
async def global_exception_handler(_: Request, exc: Exception):
    logger.error("Unhandled exception", exc_info=exc)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status_code": 500,
            "error": "Internal Server Error"
            # "detail": str(exc)
        },
    )


@app.get("/")
async def read_root():
    return JSONResponse(content={"value": "hello world!"})


@app.get("/db")
async def db_check():
    if await check_db_health():
        return JSONResponse(content={"status": "ok"})
    raise HTTPException(
        status_code=503, detail="Unnable to connect to database"
    )


@app.get("/api")
async def health_check():
    return JSONResponse(content={"status": "ok"})


app.include_router(user_router)
app.include_router(institution_router)
app.include_router(course_router)
rebuild_schema()
