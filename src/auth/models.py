from src.db.database import Base
from sqlalchemy.orm import Mapped, mapped_column

class UsersOrm(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    first_name: Mapped[str] = mapped_column(nullable=False)
    last_name: Mapped[str] = mapped_column(nullable=True)
    in_club: Mapped[bool] = mapped_column(nullable=False)
    is_entrepreneur: Mapped[bool] = mapped_column(nullable=False)