import uuid
from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, func, ForeignKey

from src.db.database import Base

if TYPE_CHECKING:
    from src.auth.models import UsersOrm

class PaymentStatus(str, Enum):
    TOP_UP = 'TOP_UP'
    DEBIT = 'DEBIT'

class PaymentsOrm(Base):
    __tablename__ = 'payments'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)

    status: Mapped[PaymentStatus]
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), insert_default=func.now()
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    amount: Mapped[float] = mapped_column(default=0)
    user: Mapped[UsersOrm] = relationship(back_populates="payments")