from app.api.course.schema import CourseOfferingLecturerOut, CourseOfferingOutLecturer, CourseOfferingOutMain, CourseOfferingOutStudent
from app.api.institution.schema import SessionOutDetailed


def rebuild_schema():
    """
    To be called after all schemas are imported to resolve forward references
    """
    from app.api.course.schema import CourseOfferingOut
    from app.api.user.schema import LecturerProfileOut
    from app.api.user.schema import UserLecturerProfile

    SessionOutDetailed.model_rebuild()
    CourseOfferingLecturerOut.model_rebuild()
    CourseOfferingOutMain.model_rebuild()
    CourseOfferingOutStudent.model_rebuild()
    CourseOfferingOutLecturer.model_rebuild()
