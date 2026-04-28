from itertools import product
from os import name

from src.auth.models import UsersOrm

from .repo import ProductsRepository
from .schemas import CreateProductFormSchema, CreateProductDbSchema, ProductRead
import uuid
from fastapi import HTTPException, status
from .models import ProductsOrm


class ProductsService:
    def __init__(self, repo: ProductsRepository):
        self.repo = repo

    # async def _get_product_or_404(self, product_id: uuid.UUID,) -> Product:
    async def add_product(
        self, product_credentials: CreateProductFormSchema, current_user: UsersOrm
    ):
        if current_user.is_entrepreneur == True:
            product_data = CreateProductDbSchema(
                name=product_credentials.name,
                description=product_credentials.description,
                price=product_credentials.price,
                created_by_id=current_user.id,
                image_url=str(product_credentials.image_url),
            )
            product = await self.repo.add_product(product_data)
            if product:
                return product
            else:
                return None
        else:
            return None

    async def products_by_search(self, search_term: str, limit: int) -> list[ProductRead]:
        products = await self.repo.search_products(search_term, limit)
        products_read = (
            [ProductRead(
                image_url=i.image_url,
                name=i.name,
                description=i.description,
                price=i.price
            ) for i in products]
        )
        return products_read

    async def get_all_products(self, limit: int, offset: int):
        products = [ProductRead(
            price=i.price,
            name=name,
            description=i.description,
            image_url=i.image_url,

        ) for i in await self.repo.get_products(limit, offset)]
        return products

    async def get_product_by_id(self, product_id: int) -> ProductRead | None:
        product = await self.repo._get_product_or_404(product_id)
        read_product = ProductRead(
            name=product.name,
            description=product.description,
            price=product.price,
            image_url=product.image_url
        )
        return read_product
