from sqlalchemy import insert, select, update, desc
from .schemas import CreateProductDbSchema
from .models import ProductsOrm
import uuid
from sqlalchemy.ext.asyncio import AsyncSession


class ProductsRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def _get_product_or_404(self, product_id: uuid.UUID) -> ProductsOrm | None:
        stmt = await self.session.execute(
            select(ProductsOrm).where(ProductsOrm.id == product_id)
        )
        product = stmt.scalar_one_or_none()
        return product if product else None

    async def list_products(
        self, limit: int = 10, offset: int = 0
    ) -> list[ProductsOrm]:
        stmt = await self.session.execute(
            select(ProductsOrm)
            .order_by(desc(ProductsOrm.created_at))
            .limit(limit)
            .offset(offset)
        )
        return list(stmt.scalars().all())

    async def add_product(
        self, products_credentials: CreateProductDbSchema
    ) -> ProductsOrm | None:
        stmt = (
            insert(ProductsOrm)
            .values(**products_credentials.model_dump())
            .returning(ProductsOrm)
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one_or_none()
