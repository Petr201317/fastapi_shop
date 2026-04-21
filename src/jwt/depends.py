from src.db.database import get_async_session
from src.core.security import verify_access_token
from src.jwt.repo import JWTRepository
from src.jwt.service import JWTService
from fastapi import Depends, Request, HTTPException
from src.core.security import jwt_authx



async def get_jwt_repository(session = Depends(get_async_session)):
    return JWTRepository(session)

async def get_jwt_service(repo = Depends(get_jwt_repository)):
    return JWTService(repo)

async def get_token_payload(request: Request):
    token = await jwt_authx.get_access_token_from_request(request)
    if not token:
        raise HTTPException(status_code=401)
    payload = verify_access_token(token)
    return payload

