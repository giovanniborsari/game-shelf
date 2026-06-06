"""Changes in collection, focus on reviews instead of collection

Revision ID: 9ad4314d012f
Revises: 010a032f98c4
Create Date: 2026-06-05 20:05:32.962854

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9ad4314d012f'
down_revision: Union[str, Sequence[str], None] = '010a032f98c4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
