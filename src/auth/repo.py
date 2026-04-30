from .schemas import AddUserSchema
from .models import UsersOrm
from sqlalchemy import insert, select, update
from decimal import Decimal
import uuid
from src.payments.models import PaymentsOrm, PaymentStatus

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
        return result.scalar()

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

    async def top_up_balance(self, user_id: int, amount: int, commit: bool = True) -> Decimal | None:
        stmt = (
            update(UsersOrm)
            .values(balance=amount + UsersOrm.balance)
            .where(UsersOrm.id == user_id)
            .returning(UsersOrm.balance)
        )
        result = await self.session.execute(stmt)
        self.session.add(
            PaymentsOrm(
                id=uuid.uuid4(),
                status=PaymentStatus.TOP_UP,
                user_id=user_id,
                amount=amount
            )
        )
        if commit:
            await self.session.commit()
        return result.scalar_one_or_none()


