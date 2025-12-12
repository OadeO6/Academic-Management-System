import logging

import redis.asyncio as redis
from tenacity import before_sleep_log, retry, retry_if_exception_type, stop_after_attempt, wait_fixed

from ..core.config import settings

logger = logging.getLogger(__name__)

# This global variable will hold the connection pool
_async_redis_client: redis.Redis | None = None


class RedisConnectionError(Exception):
    """Custom exception for Redis connection failures after exhausting retries."""

    pass


@retry(
    stop=stop_after_attempt(5),  # Sensible default, can be configured
    wait=wait_fixed(2),
    retry=retry_if_exception_type(redis.ConnectionError),
    before_sleep=before_sleep_log(logger, logging.INFO),
    reraise=True,
)
async def _attempt_redis_connect(redis_url: str) -> redis.Redis:
    """Attempts to connect and ping the Redis server with retries."""
    logger.info(f"Attempting to connect to Redis at {redis_url}...")
    client = redis.from_url(redis_url, decode_responses=True)
    await client.ping()
    logger.info("Connected to Redis successfully.")
    return client


async def connect_redis_pool():
    """Creates and initializes the global async Redis connection pool."""
    global _async_redis_client

    redis_url = settings.REDIS_URL

    try:
        _async_redis_client = await _attempt_redis_connect(redis_url)
    except Exception as e:
        logger.critical(f"Failed to connect to Redis after multiple attempts: {e}")
        raise RedisConnectionError("Failed to connect to Redis.") from e


async def close_redis_pool():
    """Closes the global async Redis connection pool."""
    global _async_redis_client
    if _async_redis_client:
        logger.info("Closing Redis connection pool...")
        await _async_redis_client.close()
        _async_redis_client = None
        logger.info("Redis connection pool closed.")


def get_async_redis_client() -> redis.Redis:
    """FastAPI dependency to get the Redis client. Raises error if not initialized."""
    if _async_redis_client is None:
        logger.critical("Redis client is not initialized!")
        raise RuntimeError("Redis client is not initialized. Check application startup.")
    return _async_redis_client
