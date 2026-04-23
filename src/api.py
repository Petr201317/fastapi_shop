from fastapi import APIRouter

from .auth.router import router as auth_router
from .products.router import router as products_router
from .cart.router import router as cart_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(products_router)
router.include_router(cart_router)