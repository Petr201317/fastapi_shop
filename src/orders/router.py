from fastapi import APIRouter, Depends
from src.jwt.depends import get_token_payload
from .schemas import OrderCreate
from .depends import get_orders_service

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/create")
async def create_order(order_credentials: OrderCreate, payload = Depends(get_token_payload), service = Depends(get_orders_service)):
    return await service.create_order(order_credentials, payload)
