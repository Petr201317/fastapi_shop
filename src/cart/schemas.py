from pydantic import BaseModel, Field, ConfigDict
import uuid
from decimal import Decimal
from typing import List
from datetime import datetime
from ..products.schemas import ProductRead
class CartItemUpdate(BaseModel):
    quantity: int = Field(..., gt=0, le=99)
class CartItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: int
    quantity: int
class CartItemAdd(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: int
    quantity: int = Field(..., gt=0, le=99)
class CartItemAddDb(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: int
    quantity: int
    user_id: int
