from __future__ import annotations
from typing import TYPE_CHECKING, List

from src.db.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from src.products.models import ProductsOrm
    from src.cart.models import CartItemsOrm
    from src.orders.models import OrdersOrm


class UsersOrm(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    first_name: Mapped[str] = mapped_column(nullable=False)
    last_name: Mapped[str] = mapped_column(nullable=True)
    in_club: Mapped[bool] = mapped_column(nullable=False)
    is_entrepreneur: Mapped[bool] = mapped_column(nullable=False)

    # relations

    created_products: Mapped[list["ProductsOrm"]] = relationship(
        back_populates="created_by"
    )  # if user is entrpreneur

    cart_items: Mapped[List["CartItemsOrm"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    orders: Mapped[List["OrdersOrm"]] = relationship(back_populates="user")
