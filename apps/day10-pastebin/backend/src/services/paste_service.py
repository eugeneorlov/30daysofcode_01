from datetime import datetime, timedelta
from typing import Optional

from sqlmodel import Session, select

from ..models.paste import Paste, PasteCreate


def create_paste(session: Session, data: PasteCreate) -> Paste:
    """Create a new paste with generated short_id and optional expiration."""
    # Calculate expires_at if expires_in_minutes is provided
    expires_at = None
    if data.expires_in_minutes:
        expires_at = datetime.utcnow() + timedelta(minutes=data.expires_in_minutes)

    # Create the paste (short_id will be generated automatically)
    paste = Paste(
        title=data.title or "Untitled",
        content=data.content,
        language=data.language or "plaintext",
        expires_at=expires_at
    )

    session.add(paste)
    session.commit()
    session.refresh(paste)
    return paste


def get_paste(session: Session, short_id: str) -> Optional[Paste]:
    """Get a paste by short_id and increment view count."""
    paste = session.exec(select(Paste).where(Paste.short_id == short_id)).first()

    if paste:
        # Check if paste is expired
        if paste.expires_at and paste.expires_at < datetime.utcnow():
            return None

        # Increment view count
        paste.view_count += 1
        session.add(paste)
        session.commit()
        session.refresh(paste)

    return paste


def list_recent(session: Session, limit: int = 20) -> list[Paste]:
    """List recent pastes, excluding expired ones, ordered by created_at desc."""
    statement = select(Paste).where(
        # Exclude expired pastes
        (Paste.expires_at.is_(None)) | (Paste.expires_at > datetime.utcnow())
    ).order_by(Paste.created_at.desc()).limit(limit)

    return list(session.exec(statement).all())


def delete_expired(session: Session) -> int:
    """Delete expired pastes and return count of deleted records."""
    now = datetime.utcnow()
    expired_pastes = session.exec(
        select(Paste).where(Paste.expires_at < now)
    ).all()

    count = len(expired_pastes)
    for paste in expired_pastes:
        session.delete(paste)

    session.commit()
    return count