from fastapi import Depends
from src.db.database import get_async_session
from src.orders.repo import OrdersRepository
from src.orders.service import OrdersService
from src.products.depends import get_products_repository
from src.auth.depends import get_users_repository


async def get_orders_repository(session = Depends(get_async_session)):
    return OrdersRepository(session)

async def get_orders_service(orders_repository = Depends(get_orders_repository), products_repo = Depends(get_products_repository), users_repo = Depends(get_users_repository)):
    return OrdersService(orders_repository, products_repo, users_repo)

