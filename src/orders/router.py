from fastapi import APIRouter, Depends
from src.jwt.depends import get_token_payload
from .schemas import OrderCreate, OrderUpdateStatus
from .depends import get_orders_service

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/create")
async def create_order(order_credentials: OrderCreate, payload = Depends(get_token_payload), service = Depends(get_orders_service)):
    return await service.create_order(order_credentials, payload)

@router.get("/")
async def get_orders(payload = Depends(get_token_payload), service = Depends(get_orders_service)):
    return await service.get_orders_for_user(payload)

