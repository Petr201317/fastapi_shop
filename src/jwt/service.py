from .repo import JWTRepository
from src.core.security import generate_refresh_token, generate_access_token
from .schemas import AddRefreshJWTSchema, AccessTokenDataSchema


class JWTService:
    def __init__(self, repo: JWTRepository):
        self.repo = repo

    async def create_refresh_jwt_token(self, user_id: int):
        token = generate_refresh_token(user_id)
        res = await self.repo.add_refresh_jwt(AddRefreshJWTSchema(token=token, user_id=user_id))
        return res.token

    async def create_access_token(self, data: AccessTokenDataSchema, user_id: int):
        return generate_access_token(data=data, user_id=user_id)


