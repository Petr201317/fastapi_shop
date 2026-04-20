from fastapi import Depends, Request
from src.db.database import get_async_session
from .repo import UsersRepository
from .services import AuthService
from src.jwt.depends import get_jwt_service, get_token_payload


async def get_users_repository(session = Depends(get_async_session)):
    return UsersRepository(session)

async def get_auth_service(repo = Depends(get_users_repository), jwt_service = Depends(get_jwt_service)):
    return AuthService(repo, jwt_service)

async def get_current_user(service = Depends(get_auth_service), token_payload = Depends(get_token_payload)):
    return await service.get_current_user(token_payload)

