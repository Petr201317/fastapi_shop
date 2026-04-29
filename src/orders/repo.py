from decimal import Decimal

from sqlalchemy import select, update
from .models import OrdersOrm, OrderItemsOrm
from src.products.models import ProductsOrm
from src.auth.models import UsersOrm

from src.orders.schemas import OrderCreateDb


class OrdersRepository:
    def __init__(self, session):
        self.session = session

    async def add_order(self, order_data: OrderCreateDb):
        order = OrdersOrm(
            user_id=order_data.user_id,
            total_price=order_data.total_price,
            items=[
                OrderItemsOrm(
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price_at_purchase=item.price_at_purchase,
                )
                for item in order_data.items
            ]
        )
        self.session.add(order)

    async def try_debit_user_balance(self, user_id: int, amount: Decimal) -> bool:
        stmt = (
            update(UsersOrm)
            .where(UsersOrm.id == user_id, UsersOrm.balance >= amount)
            .values(balance=UsersOrm.balance - amount)
            .returning(UsersOrm.id)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none() is not None

    async def commit(self):
        await self.session.commit()

    async def rollback(self):
        await self.session.rollback()

    async def get_products_prices(self, product_ids: list[int]) -> dict[int, Decimal]:
        if not product_ids:
            return {}

        query = select(ProductsOrm.id, ProductsOrm.price).where(ProductsOrm.id.in_(product_ids))
        result = await self.session.execute(query)
        return {product_id: price for product_id, price in result.all()}

    async def get_orders_by_user_id(self, user_id: int):
        query = (
            select(OrdersOrm)
            .where(OrdersOrm.user_id == user_id)
        )

        res = await self.session.execute(query)
        return res.scalars().all()

