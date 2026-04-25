import datetime
import uuid

from sqlalchemy import ForeignKey

from src.db.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

def get_expire() -> datetime.datetime:
    return datetime.datetime.now() + datetime.timedelta(days=55)


class RefreshTokensOrm(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    token: Mapped[str]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now)
    expires_at: Mapped[datetime.datetime] = mapped_column(default=get_expire)

