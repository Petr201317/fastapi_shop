from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_async_session
from src.products.repo import ProductsRepository
from src.products.service import ProductsService


async def get_products_repository(session: AsyncSession = Depends(get_async_session)):
    return ProductsRepository(session)

async def get_products_service(repository: ProductsRepository = Depends(get_products_repository)):
    return ProductsService(repository)

async def get_product_by_id(product_id: int, service: ProductsService = Depends(get_products_service)):
    res = await service.get_product_by_id(product_id)
    if not res:
        raise HTTPException(status_code=404)
    return res

async def get_products_by_search(search_term: str, limit: int, service: ProductsService = Depends(get_products_service)):
    return await service.products_by_search(search_term, limit)