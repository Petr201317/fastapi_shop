from fastapi import APIRouter, Depends, Response, HTTPException, status
from src.auth.schemas import UserRegFormSchema, UserLoginFormSchema, TopUpUserBalance
from .depends import get_auth_service, get_current_user
from src.auth.services import AuthService
from src.core.security import security_settings
from ..jwt.depends import get_token_payload, get_refresh_token_payload

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/reg",
)
async def reg(
    credentials: UserRegFormSchema, service: AuthService = Depends(get_auth_service)
):
    res = await service.reg_user(credentials)
    return res if res else HTTPException(status_code=status.HTTP_409_CONFLICT)


@router.post("/login")
async def login(
    response: Response,
    credentials: UserLoginFormSchema,
    auth_service: AuthService = Depends(get_auth_service),
):
    tokens = await auth_service.login_user(credentials)
    if tokens:
        response.set_cookie(
            key=security_settings.JWT_ACCESS_COOKIE_NAME, value=tokens.access_token
        )
        response.set_cookie(
            key=security_settings.JWT_REFRESH_COOKIE_NAME, value=tokens.refresh_token
        )
    else:
        raise HTTPException(status_code=401)


@router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return current_user

@router.get("/refresh_access_token")
async def refresh_access_token(response: Response, payload = Depends(get_refresh_token_payload), service: AuthService = Depends(get_auth_service)):
    new_token = await service.new_access_token(payload)
    response.set_cookie(
        key=security_settings.JWT_ACCESS_COOKIE_NAME, value=new_token
    )

@router.post("/top_up")
async def top_up(credentials: TopUpUserBalance, payload = Depends(get_token_payload), service = Depends(get_auth_service)):
    return await service.top_up_user_balance(payload=payload, credentials=credentials)

