import uuid

from .schemas import CartItemAddDb
from sqlalchemy import insert, select, delete
from sqlalchemy.orm import selectinload
from .models import CartItemsOrm
from ..auth.models import UsersOrm


class CartRepo:
    def __init__(self, session):
        self.session = session

    async def add_product_in_cart(self, cart_data: CartItemAddDb):
        stmt = (
            insert(CartItemsOrm)
            .values(**cart_data.model_dump())
            .returning(CartItemsOrm)
        )
        res = await self.session.execute(stmt)
        await self.session.commit()
        return res.scalar()

    async def get_user_cart(self, user_id: int) -> list[CartItemsOrm]:
        query = (
            select(CartItemsOrm)
            .where(CartItemsOrm.user_id == user_id)
        )

        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def delete_product_in_cart(self, cart_item_id: uuid.UUID) -> CartItemsOrm:
        stmt = (
            delete(CartItemsOrm)
            .where(CartItemsOrm.id == cart_item_id)
            .returning(CartItemsOrm)
        )

        res = await self.session.execute(stmt)
        await self.session.commit()
        return res.scalar_one_or_none()

    async def get_user_by_cart_item_id(self, cart_item_id: uuid.UUID) -> UsersOrm:
        query = (
            select(CartItemsOrm)
            .where(CartItemsOrm.id == cart_item_id)
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()