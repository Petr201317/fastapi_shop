"""add price_at_purchase to order_items

Revision ID: 9d8d0b4a6c11
Revises: 3fc053e997c9
Create Date: 2026-04-29 20:47:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9d8d0b4a6c11"
down_revision: Union[str, Sequence[str], None] = "3fc053e997c9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "order_items",
        sa.Column("price_at_purchase", sa.Numeric(10, 2), nullable=True),
    )
    op.execute(
        """
        UPDATE order_items oi
        SET price_at_purchase = p.price
        FROM products p
        WHERE oi.product_id = p.id
        """
    )
    op.execute(
        """
        UPDATE order_items
        SET price_at_purchase = 0.00
        WHERE price_at_purchase IS NULL
        """
    )
    op.alter_column("order_items", "price_at_purchase", nullable=False)


def downgrade() -> None:
    op.drop_column("order_items", "price_at_purchase")
