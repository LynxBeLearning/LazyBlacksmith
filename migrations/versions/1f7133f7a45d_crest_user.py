"""crest user

Revision ID: 1f7133f7a45d
Revises: 53eb8abce4de
Create Date: 2015-08-03 19:04:20.780000

"""

# revision identifiers, used by Alembic.
revision = '1f7133f7a45d'
down_revision = '53eb8abce4de'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('eve_user',
    sa.Column('character_id', sa.Integer(), autoincrement=False, nullable=False),
    sa.Column('character_owner_hash', sa.String(length=255), nullable=True),
    sa.Column('character_name', sa.String(length=200), nullable=True),
    sa.Column('scopes', sa.String(length=200), nullable=True),
    sa.Column('token_type', sa.String(length=20), nullable=True),
    sa.Column('access_token', sa.String(length=100), nullable=True),
    sa.Column('access_token_expires_on', sa.DateTime(timezone=True), nullable=True),
    sa.Column('access_token_expires_in', sa.Integer(), nullable=True),
    sa.Column('refresh_token', sa.String(length=100), nullable=True),
    sa.Column('refresh_token_expires_on', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text(u'now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text(u'now()'), nullable=True),
    sa.PrimaryKeyConstraint('character_id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('eve_user')
    ### end Alembic commands ###