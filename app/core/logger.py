import logging
import logging.config
import os
import sys

from .config import settings


LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s - %(process)d - %(levelname)s - %(name)s - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "level": "DEBUG",
            "stream": sys.stdout,
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
