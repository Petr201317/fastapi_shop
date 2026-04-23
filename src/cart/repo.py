from .schemas import CartItemAddDb
from sqlalchemy import insert
from .models import CartItemsOrm

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
        return res.scalar()