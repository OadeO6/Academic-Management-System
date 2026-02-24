import logging
import logging.config
from asgi_correlation_id.log_filters import CorrelationIdFilter
import os
import sys

from .config import settings


LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    'filters': {
        "correlation_id": {
            "()": CorrelationIdFilter,
            "uuid_length": 32
        }
    },
    "formatters": {
        "standard": {
            # "format": "%(asctime)s - %(process)d - %(levelname)s + %(name)s - %(message)s",
            "format": "%(asctime)s - %(process)d - %(levelname)s + %(name)s - %(message)s [%(correlation_id)s]",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "json": {
            "format": '{"timestamp": "%(asctime)s", "name": "%(name)s", "level": "%(levelname)s", "message": "%(message)s", "file": "%(filename)s", "line": %(lineno)d, "correlation_id": "%(correlation_id)s"}',
            "datefmt": "%Y-%m-%d %H:%M:%S"
        }

    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "level": "DEBUG",
            "stream": sys.stdout,
            "filters": ["correlation_id"],
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            # "formatter": "detailed",
            "formatter": "json",
            "filename": "app.log",
            "maxBytes": 10485760,  # 10MB
            "filters": ["correlation_id"],
            "backupCount": 5
        },
    },
    "loggers": {
        "": {
            "handlers": ["console"],
            "level": os.getenv("LOG_LEVEL", "INFO").upper(),
            "propagate": False,
        },
        "uvicorn": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "sqlalchemy.engine": {
            "handlers": ["console"],
            "level": os.getenv("SQLALCHEMY_LOG_LEVEL", "INFO").upper(),
            "propagate": False,
        },
        "app": {
            "handlers": ["console"],
            "level": os.getenv("LOG_LEVEL", "INFO").upper(),
            "propagate": False,
        },
    },
}


def setup_logging():
    """Applies the dictionary-based logging configuration."""
    try:
        logging.config.dictConfig(LOGGING_CONFIG)
        logging.getLogger(__name__).info(f"Logging configured. Level set to {os.getenv('LOG_LEVEL', 'INFO').upper()}.")
    except Exception as e:
        logging.basicConfig(level=logging.INFO)
        logging.error(f"Failed to configure logging using dictConfig: {e}", exc_info=True)
