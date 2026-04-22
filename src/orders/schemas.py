from pydantic import BaseModel, Field, ConfigDict
import uuid
from decimal import Decimal
from typing import List
from datetime import datetime
from .models import OrderStatus


class OrderItemCreate(BaseModel):
    product_id: uuid.UUID
    quantity: int = Field(default=1, gt=0)


class OrderItemRead(BaseModel):
    product_id: uuid.UUID
    quantity: int
    price_at_purchase: Decimal

    model_config = ConfigDict(from_attributes=True)


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]


class OrderRead(BaseModel):
    id: uuid.UUID
    user_id: int
    total_price: Decimal
    status: OrderStatus
    items: List[OrderItemRead]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
