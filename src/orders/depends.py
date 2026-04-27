from fastapi import Depends
from src.db.database import get_async_session
from src.orders.repo import OrdersRepository
from src.orders.service import OrdersService


async def get_orders_repository(session = Depends(get_async_session)):
    return OrdersRepository(session)

async def get_orders_service(orders_repository = Depends(get_orders_repository)):
    return OrdersService(orders_repository)

