from __future__ import annotations
from typing import TYPE_CHECKING

from ..db.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy import ForeignKey, func
from datetime import datetime

if TYPE_CHECKING:
    from ..products.models import ProductsOrm
    from ..auth.models import UsersOrm


class CartItemsOrm(Base):
    __tablename__ = "cart_items"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE")
    )

    quantity: Mapped[int] = mapped_column(default=1)

    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    product: Mapped["ProductsOrm"] = relationship()
    user: Mapped["UsersOrm"] = relationship(
        "UsersOrm",
        back_populates="cart_items"
    )
