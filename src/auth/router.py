from fastapi import APIRouter, Depends, Response
from src.auth.schemas import UserRegFormSchema, UserLoginFormSchema
from .depends import get_auth_service, get_current_user
from src.auth.services import AuthService
from src.core.security import security_settings

router = APIRouter(prefix="/auth")

@router.post("/reg")
async def reg(
        credentials: UserRegFormSchema,
        service: AuthService = Depends(get_auth_service)
):
    return await service.reg_user(credentials)

@router.post("/login")
async def login(
        response: Response,
        credentials: UserLoginFormSchema,
        auth_service: AuthService = Depends(get_auth_service),
):
    tokens = await auth_service.login_user(credentials)
    response.set_cookie(key=security_settings.JWT_ACCESS_COOKIE_NAME, value=tokens.access_token)
    response.set_cookie(key=security_settings.JWT_REFRESH_COOKIE_NAME, value=tokens.refresh_token)
    return tokens

@router.get("/me")
async def me(
        current_user = Depends(get_current_user)
):
    return current_user
