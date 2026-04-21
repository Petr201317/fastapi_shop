from src.auth.models import UsersOrm

from .repo import ProductsRepository
from .schemas import CreateProductFormSchema, CreateProductDbSchema
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

    async def get_all_products(self, limit: int, offset: int):
        return await self.repo.list_products(limit=limit, offset=offset)

    async def get_product_by_id(self, product_id: uuid.UUID) -> ProductsOrm | None:
        product = await self.repo._get_product_or_404(product_id)

        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {product_id} not found",
            )

        return product
