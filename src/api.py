from fastapi import APIRouter

from .auth.router import router as auth_router
from .db.router import router as db_router
from .products.router import router as products_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(db_router)
router.include_router(products_router)