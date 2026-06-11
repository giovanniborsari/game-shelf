"""wishlist changes

Revision ID: ee9c885a3f5d
Revises: 701160b00b60
Create Date: 2026-06-10 21:47:01.174016

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ee9c885a3f5d'
down_revision: Union[str, Sequence[str], None] = '701160b00b60'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
