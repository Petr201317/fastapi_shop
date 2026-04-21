from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy import create_engine, inspect
from .config import db_settings

async_engine = create_async_engine(
    url=db_settings.db_url_async,
    echo=True,
)

from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async_session = async_sessionmaker(async_engine, expire_on_commit=False)
    async with async_session() as session:
        yield session

class Base(DeclarativeBase):
    pass
