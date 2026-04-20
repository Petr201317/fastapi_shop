from src.auth.models import UsersOrm

from .repo import ProductsRepository
from .schemas import CreateProductFormSchema, CreateProductDbSchema

class ProductsService:
    def __init__(self, repo: ProductsRepository):
        self.repo = repo


    async def add_product(self, product_credentials: CreateProductFormSchema, current_user: UsersOrm):
        if current_user.is_entrepreneur == True:
            product_data = CreateProductDbSchema(
                name=product_credentials.name,
                description=product_credentials.description,
                price=product_credentials.price,
                created_by_id=current_user.id,
                image_url=product_credentials.image_url
            )
            product = await self.repo.add_product(product_data)
            if product:
                return product
            else:
                return None
        else:
            return None



