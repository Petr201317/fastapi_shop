from __future__ import annotations
from typing import TYPE_CHECKING, List
import uuid

from ..db.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Enum as SAEnum, ForeignKey, Integer, Numeric, func
from enum import Enum
from decimal import Decimal
from datetime import datetime

if TYPE_CHECKING:
    from ..auth.models import UsersOrm
    from ..products.models import ProductsOrm
class OrderStatus(str, Enum):
    PENDING = "pending"
    SHIPPED = "shipped"
    CANCELLED = "cancelled"

class OrdersOrm(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="RESTRICT"))
    total_price: Mapped[Decimal] = mapped_column(default=0.00)
    status: Mapped[OrderStatus] = mapped_column(
        SAEnum(OrderStatus, name="order_status"),
        server_default=OrderStatus.PENDING,
        nullable=False,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    # relations
    user: Mapped["UsersOrm"] = relationship(back_populates="orders")
    items: Mapped[List["OrderItemsOrm"]] = relationship(back_populates="order")
class OrderItemsOrm(Base):
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"))
    product_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True
    )

    quantity: Mapped[int] = mapped_column(default=1)
    price_at_purchase: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)


    # relations
    order: Mapped["OrdersOrm"] = relationship(back_populates="items")
    product: Mapped["ProductsOrm"] = relationship(back_populates="order_items")
