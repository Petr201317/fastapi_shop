import datetime

from sqlalchemy import ForeignKey

from src.db.database import Base
from sqlalchemy.orm import Mapped, mapped_column

def get_expire() -> datetime.datetime:
    return datetime.datetime.now() + datetime.timedelta(days=55)


class RefreshTokensOrm(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[int] = mapped_column(primary_key=True)

    token: Mapped[str]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now)
    expires_at: Mapped[datetime.datetime] = mapped_column(default=get_expire)

