from fastapi import APIRouter, Depends
from .depends import get_products_service, get_product_by_id
from .schemas import CreateProductFormSchema
from src.auth.depends import get_current_user
from .service import ProductsService


router = APIRouter(prefix="/products", tags=["products"])


@router.post("/create")
async def create_product(
    credentials: CreateProductFormSchema,
    current_user=Depends(get_current_user),
    service=Depends(get_products_service),
):
    return await service.add_product(credentials, current_user)


@router.get("/{product_id}")
async def get_product(
    product = Depends(get_product_by_id),
):
    return product


@router.get("/")
async def list_products(
    limit: int = 10,
    offset: int = 0,
    service: ProductsService = Depends(get_products_service),
):
    return await service.get_all_products(limit, offset)
