from __future__ import annotations
from typing import TYPE_CHECKING, List
from datetime import datetime

from sqlalchemy import ForeignKey, String, Numeric, Text, func, DateTime

from src.db.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from decimal import Decimal

if TYPE_CHECKING:
    from src.auth.models import UsersOrm
    from src.orders.models import OrderItemsOrm


class ProductsOrm(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    image_url: Mapped[str] = mapped_column(String(500))

    created_by_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), insert_default=func.now()
    )

    # relations
    created_by: Mapped["UsersOrm"] = relationship(back_populates="created_products")
    order_items: Mapped[List["OrderItemsOrm"]] = relationship(back_populates="product")
