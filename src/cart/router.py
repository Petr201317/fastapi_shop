from fastapi import APIRouter, Depends
from .schemas import CartItemAdd
from .depends import get_cart_service
from src.jwt.depends import get_token_payload

router = APIRouter(prefix="/cart", tags=["cart"])

@router.post("/add_product", tags=["cart"])
async def add_product_in_cart(
    credentials: CartItemAdd,
    user_payload = Depends(get_token_payload),
    service = Depends(get_cart_service)
):
    return await service.add_product_in_cart(credentials=credentials, user_payload=user_payload)


