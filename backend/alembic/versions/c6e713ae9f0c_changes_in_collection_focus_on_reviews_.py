"""Changes in collection, focus on reviews instead of collection rating variables

Revision ID: c6e713ae9f0c
Revises: 9b128c47b3fd
Create Date: 2026-06-05 20:41:06.242399

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c6e713ae9f0c'
down_revision: Union[str, Sequence[str], None] = '9b128c47b3fd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
