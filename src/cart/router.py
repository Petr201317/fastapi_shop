import uuid

from fastapi import APIRouter, Depends
from .schemas import CartItemAdd
from .depends import get_cart_service, get_user_cart
from src.jwt.depends import get_token_payload

router = APIRouter(prefix="/cart", tags=["cart"])

@router.post("/add_product", tags=["cart"])
async def add_product_in_cart(
    credentials: CartItemAdd,
    user_payload = Depends(get_token_payload),
    service = Depends(get_cart_service)
):
    return await service.add_product_in_cart(credentials=credentials, user_payload=user_payload)


@router.get("/cart", tags=["cart"])
async def get_cart(user_cart = Depends(get_user_cart)):
    return user_cart

@router.post("/del_product", tags=["cart"])
async def del_product(cart_item_id: uuid.UUID, user_payload = Depends(get_token_payload), service = Depends(get_cart_service)):
    res = await service.delete_product_in_cart(cart_item_id=cart_item_id, user_payload=user_payload)
    if res:
        return res
    else:
        return None


