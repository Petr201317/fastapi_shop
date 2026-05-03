from fastapi import Depends
from .repo import CartRepo
from .service import CartService
from src.jwt.depends import get_token_payload

from ..db.database import get_async_session

async def get_cart_repo(session = Depends(get_async_session)):
    return CartRepo(session)

async def get_cart_service(repo = Depends(get_cart_repo)):
    return CartService(repo)

async def get_user_cart(service = Depends(get_cart_service), payload = Depends(get_token_payload)):
    return await service.get_user_cart(payload)
