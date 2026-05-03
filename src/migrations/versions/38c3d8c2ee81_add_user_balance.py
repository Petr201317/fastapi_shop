"""add users balance column

Revision ID: 38c3d8c2ee81
Revises: 9d8d0b4a6c11
Create Date: 2026-04-29 20:51:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "38c3d8c2ee81"
down_revision: Union[str, Sequence[str], None] = "9d8d0b4a6c11"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("balance", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0.00")),
    )


def downgrade() -> None:
    op.drop_column("users", "balance")
