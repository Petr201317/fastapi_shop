from authx import TokenPayload
from fastapi import Response

from .schemas import UserRegFormSchema, AddUserSchema, UserLoginFormSchema, TokensSchema
from .repo import UsersRepository
from src.core.security import hash_password, verify_password
from src.jwt.service import JWTService
from ..jwt.schemas import AccessTokenDataSchema


class AuthService:
    def __init__(self, users_repo: UsersRepository, jwt_service: JWTService):
        self.users_repo = users_repo
        self.jwt_service = jwt_service

    async def reg_user(self, user_credentials: UserRegFormSchema):
        users_hashed_password = hash_password(user_credentials.password)
        user_db_data = AddUserSchema(
            email = user_credentials.email,
            hashed_password = users_hashed_password,
            first_name = user_credentials.first_name,
            last_name = user_credentials.last_name,
            is_entrepreneur = user_credentials.is_entrepreneur,
            in_club = user_credentials.in_club
        )

        user = await self.users_repo.add_user(user_db_data)
        return user

    async def login_user(self, user_credentials: UserLoginFormSchema):
        user = await self.users_repo.get_user_by_email(user_credentials.email)
        if user:
            if verify_password(user_credentials.password, user.hashed_password):
                access_token_data = AccessTokenDataSchema(
                    in_club=user.in_club,
                    is_entrepreneur=user.is_entrepreneur
                )
                access_token = await self.jwt_service.create_access_token(data=access_token_data, user_id=user.id)
                refresh_token = await self.jwt_service.create_refresh_jwt_token(user_id=user.id)
                return TokensSchema(access_token=access_token, refresh_token=refresh_token)
            else:
                return None
        else:
            return None

    async def get_current_user(self, payload: TokenPayload):
        user = await self.users_repo.get_user_by_id(user_id=int(payload.sub))
        if user:
            return user
        else:
            return None










