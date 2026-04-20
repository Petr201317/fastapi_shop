from fastapi import APIRouter, Depends
from .depends import get_products_service
from .schemas import CreateProductFormSchema
from src.auth.depends import get_current_user

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/create")
async def create_product(credentials: CreateProductFormSchema, current_user = Depends(get_current_user), service = Depends(get_products_service)):
    return await service.add_product(credentials, current_user)



