"""wishlist changes

Revision ID: fe4925e18fcd
Revises: ee9c885a3f5d
Create Date: 2026-06-10 21:48:05.616742

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fe4925e18fcd'
down_revision: Union[str, Sequence[str], None] = 'ee9c885a3f5d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
