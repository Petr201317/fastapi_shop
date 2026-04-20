from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_async_session
from src.products.repo import ProductsRepository
from src.products.service import ProductsService


def get_products_repository(session: AsyncSession = Depends(get_async_session)):
    return ProductsRepository(session)

def get_products_service(repository: ProductsRepository = Depends(get_products_repository)):
    return ProductsService(repository)