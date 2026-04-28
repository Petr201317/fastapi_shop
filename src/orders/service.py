
from .repo import OrdersRepository
from .schemas import OrderCreate, OrderCreateDb, OrderItemCreate


class OrdersService:
    def __init__(self, repo: OrdersRepository):
        self.repo = repo

    async def create_order(self, order_credentials: OrderCreate, payload):
        user_id = int(payload.sub)
        order_db_data = OrderCreateDb(
            user_id=user_id,
            total_price=order_credentials.total_price,
            items=order_credentials.items,
        )
        await self.repo.add_order(order_db_data)
        return True

    async def get_orders_for_user(self, payload):
        user_id = int(payload.sub)
        res = await self.repo.get_orders_by_user_id(user_id)
        return res