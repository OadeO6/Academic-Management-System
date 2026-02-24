from sqlalchemy.exc import IntegrityError


POSTGRES_UNIQUE_VIOLATION = "23505"
POSTGRES_FOREIGN_KEY_VIOLATION = "23503"
POSTGRES_NOT_NULL_VIOLATION = "23502"


# NOTE: POSTGRESS_SPECIFIC
def is_unique_violation(e: IntegrityError) -> bool:
    # HACK: This is a hacky way to check if the error is a unique violation
    # FIXME: Find a better way to do this, this could brake in the future
    # TODO: Find a better way to do this
    if hasattr(e.orig, 'pgcode') and e.orig.pgcode == POSTGRES_UNIQUE_VIOLATION:
        return True
    return False

def is_foreign_key_violation(e: IntegrityError) -> bool:
    # HACK: This is a hacky way to check if the error is a foreign key violation
    # FIXME: Find a better way to do this, this could brake in the future
    # TODO: Find a better way to do this
    if hasattr(e.orig, 'pgcode') and e.orig.pgcode == POSTGRES_FOREIGN_KEY_VIOLATION:
        return True
    return False

class CustomError(Exception):
    def __init__(
        self, message: str = "Something went wrong",
        name="Internal Server Error", code: int | None = None
    ):
        self.message = message
        self.name = name
        self.code = code
        super().__init__(self.message, self.name)


class DataNotFound(CustomError):
    def __init__(
        self, message: str = "Invalid fetch",
        name="Invalid Fetch Data",
        code: int = 400
    ):
        super().__init__(message, name, code)

class DuplicateData(CustomError):
    def __init__(
        self, message: str = "Duplicate data",
        name="Duplicate Data",
        code: int = 400
    ):
        super().__init__(message, name, code)

class CreationDependencyError(CustomError):
    """
    Raised when creating a record that references a non-existent
    ID in another table (Foreign Key Violation).
    """
    def __init__(
        self,
        invalid_ref: str,
        name="Foreign Key Violation",
        code: int = 400,
        message: str | None = None,
    ):
        super().__init__(
            message or f"{invalid_ref} not found",
            name,
            code
        )


class CourseOfferingDependencyError(CreationDependencyError):
    def __init__(
            self,
            message: str | None = None,
            invalid_ref: str = "course_offering",
            code: int = 400
    ):
        super().__init__(
            invalid_ref=invalid_ref,
            code=code,
            message=message
        )
