"""Changes in collection, focus on reviews instead of collection

Revision ID: 9b128c47b3fd
Revises: 9ad4314d012f
Create Date: 2026-06-05 20:24:51.804543

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9b128c47b3fd'
down_revision: Union[str, Sequence[str], None] = '9ad4314d012f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
