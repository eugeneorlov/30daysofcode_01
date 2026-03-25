from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from ..database import get_session
from ..models.paste import PasteCreate, PasteOut, PasteListItem
from ..services import paste_service

router = APIRouter()


@router.post("/", response_model=PasteOut)
def create_paste(paste_data: PasteCreate, session: Session = Depends(get_session)):
    """Create a new paste."""
    paste = paste_service.create_paste(session, paste_data)
    return paste


@router.get("/recent", response_model=list[PasteListItem])
def get_recent_pastes(limit: int = 20, session: Session = Depends(get_session)):
    """Get list of recent pastes."""
    pastes = paste_service.list_recent(session, limit)
    return [
        PasteListItem(
            short_id=paste.short_id,
            title=paste.title,
            language=paste.language,
            created_at=paste.created_at,
            view_count=paste.view_count
        )
        for paste in pastes
    ]


@router.get("/{short_id}", response_model=PasteOut)
def get_paste(short_id: str, session: Session = Depends(get_session)):
    """Get a paste by short_id."""
    paste = paste_service.get_paste(session, short_id)
    if not paste:
        raise HTTPException(status_code=404, detail="Paste not found or expired")
    return paste


@router.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}