import re
from typing import Any

from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, declared_attr


class ReprMixin:
    def __repr__(self) -> str:
        """
        Automatically build a repr string from the model’s class name
        and its column attributes (like id, email, etc.).
        """
        values = []
        for col in getattr(self, "__repr_attrs__", []):
            value = getattr(self, col, None)
            values.append(f"{col}={value!r}")
        values_str = ", ".join(values)
        return f"<{self.__class__.__name__}({values_str})>"


class Base(AsyncAttrs, DeclarativeBase, ReprMixin):
    id: Any
    # Turn Class name to table name

    @declared_attr
    def __tablename__(cls) -> str:
        # Insert underscore before capital letters, except at the start
        s1 = re.sub(r'(.)([A-Z][a-z]+)', r'\1_\2', cls.__name__)
        # Handle cases like "HTTPResponse" → "http_response"
        return re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', s1).lower()
