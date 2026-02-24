from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


Mode = Literal["dev", "prod"]


class Init(BaseSettings):
    APP_ENV: Mode = "dev"


class BasicConfig(Init, BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    SECRET_KEY: str

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int | None
    POSTGRES_DB: str | None
    POSTGRES_USER: str | None
    POSTGRES_PASSWORD: str | None

    @property
    def SYNC_POSTGRES_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    @property
    def ASYNC_POSTGRES_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    USE_REDIS: bool = False
    REDIS_URL: str | None = None


class Dev(BasicConfig):
    DEBUG: bool = True


class Prod(BasicConfig):
    DEBUG: bool = False


if Init().APP_ENV == "dev":
    settings = Dev()
else:
    settings = Prod()
