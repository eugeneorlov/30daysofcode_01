import secrets
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field
from sqlmodel import SQLModel, Field as SQLField, Column, String, DateTime, Index


class Paste(SQLModel, table=True):
    """SQLModel table for storing paste data."""

    id: Optional[int] = SQLField(default=None, primary_key=True)
    short_id: str = SQLField(
        default_factory=lambda: secrets.token_urlsafe(6),
        unique=True,
        index=True,
        max_length=8
    )
    title: str = SQLField(default="Untitled")
    content: str = SQLField()
    language: str = SQLField(default="plaintext")
    created_at: datetime = SQLField(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, nullable=False)
    )
    expires_at: Optional[datetime] = SQLField(
        default=None,
        sa_column=Column(DateTime, nullable=True)
    )
    view_count: int = SQLField(default=0)


# Pydantic schemas for API

class PasteCreate(BaseModel):
    """Schema for creating a new paste."""
    content: str
    title: Optional[str] = None
    language: Optional[str] = None
    expires_in_minutes: Optional[int] = None


class PasteOut(BaseModel):
    """Schema for returning paste data."""
    id: int
    short_id: str
    title: str
    content: str
    language: str
    created_at: datetime
    expires_at: Optional[datetime] = None
    view_count: int


class PasteListItem(BaseModel):
    """Schema for returning paste list items (without content)."""
    short_id: str
    title: str
    language: str
    created_at: datetime
    view_count: int