from sqlalchemy import insert, select
from .models import OrdersOrm, OrderItemsOrm

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
                    quantity=item.quantity
                )
                for item in order_data.items
            ]
        )
        self.session.add(order)
        await self.session.commit()

    async def get_orders_by_user_id(self, user_id: int):
        query = (
            select(OrdersOrm)
            .where(OrdersOrm.user_id == user_id)
        )

        res = await self.session.execute(query).scalars().all()
        return res

