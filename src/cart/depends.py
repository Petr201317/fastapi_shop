from fastapi import Depends
from .repo import CartRepo
from .service import CartService

from ..db.database import get_async_session

async def get_cart_repo(session = Depends(get_async_session)):
    return CartRepo(session)

async def get_cart_service(repo = Depends(get_cart_repo)):
    return CartService(repo)
