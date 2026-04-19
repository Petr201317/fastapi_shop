from .schemas import AddUserSchema
from .models import UsersOrm
from sqlalchemy import insert, select

class UsersRepository:
    def __init__(self, session):
        self.session = session

    async def add_user(self, user_credentials: AddUserSchema) -> UsersOrm | None:
        stmt = (
                insert(UsersOrm)
                .values(user_credentials.model_dump())
                .returning(UsersOrm)
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one_or_none()

    async def get_user_by_email(self, email: str) -> UsersOrm | None:
        query = (
            select(UsersOrm)
            .where(UsersOrm.email == email)
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: int) -> UsersOrm | None:
        query = (
            select(UsersOrm)
            .where(UsersOrm.id == user_id)
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()



