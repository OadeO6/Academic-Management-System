from typing import Annotated

from app.api.user.models import User
from app.api.user.repository import UserRepo
from fastapi import Depends



async def get_user_repo():
    user_repo = UserRepo(User)
    return user_repo


from app.api.user.service import UserService



UserServiceDep = Annotated[UserService, Depends()]
