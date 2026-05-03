from .models import RefreshTokensOrm
from .schemas import AddRefreshJWTSchema
from sqlalchemy import insert, select
import uuid


class JWTRepository:
    def __init__(self, session):
        self.session = session

    async def add_refresh_jwt(self, user_credentials: AddRefreshJWTSchema) -> RefreshTokensOrm | None:
        stmt = (
            insert(RefreshTokensOrm)
            .values(id=uuid.uuid4(), **user_credentials.model_dump())
            .returning(RefreshTokensOrm)
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one_or_none()


