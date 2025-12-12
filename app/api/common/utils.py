from app.core.config import settings


def use_redis():
    return settings.USE_REDIS and settings.REDIS_URL
