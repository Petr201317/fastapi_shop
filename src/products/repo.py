from sqlalchemy import insert, select, update, desc, text, func, Float
from .schemas import CreateProductDbSchema
from .models import ProductsOrm
from src.auth.models import UsersOrm
import uuid
from sqlalchemy.ext.asyncio import AsyncSession


class ProductsRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def _get_product_or_404(self, product_id: int) -> ProductsOrm | None:
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

    async def search_products(
            self, search_term: str, limit: int = 10
    ):
        sim = func.similarity(ProductsOrm.name, search_term)

        stmt = (
            select(
                ProductsOrm
            )
            .where(ProductsOrm.name.op('%')(search_term))
            .order_by(sim.desc())
            .limit(limit)
        )

        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def get_user_by_product_id(self, product_id: int) -> UsersOrm | None:
        product = await self._get_product_or_404(product_id)
        query = (
            select(UsersOrm)
            .where(UsersOrm.id == product.created_by_id)
        )
        res = await self.session.execute(query)
        return res.scalar_one_or_none()
