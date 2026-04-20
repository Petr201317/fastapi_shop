import datetime

from sqlalchemy import ForeignKey

from src.db.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship


class ProductsOrm(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str]
    description: Mapped[str]
    price: Mapped[float]
    image_url: Mapped[str]

    created_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_by: Mapped["UsersOrm"] = relationship(back_populates="created_products")

    created_at: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now)

