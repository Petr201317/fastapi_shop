from sqlalchemy import insert, select, update
from .schemas import CreateProductDbSchema
from .models import ProductsOrm

class ProductsRepository:
    def __init__(self, session):
        self.session = session


    async def add_product(self, products_credentials: CreateProductDbSchema) -> ProductsOrm | None:
        stmt = (
            insert(ProductsOrm).
            values(**products_credentials.model_dump())
            .returning(ProductsOrm)
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one_or_none()








