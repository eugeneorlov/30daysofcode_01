from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlmodel import Session

from src.database import get_session
from src.services import technique_service

router = APIRouter(prefix="/techniques", tags=["techniques"])


class TechniqueCard(BaseModel):
    id: int
    name: str
    position: str
    type: str
    difficulty: str
    description: str


class RelationshipOut(BaseModel):
    relationship_type: str
    technique: TechniqueCard


class TechniqueDetail(TechniqueCard):
    steps: list[str]
    common_mistakes: list[str]
    counters: list[str]
    outgoing: list[RelationshipOut]
    incoming: list[RelationshipOut]


@router.get("", response_model=list[TechniqueCard])
def list_techniques(
    position: Optional[str] = Query(default=None),
    type: Optional[str] = Query(default=None),
    difficulty: Optional[str] = Query(default=None),
    q: Optional[str] = Query(default=None),
    session: Session = Depends(get_session),
) -> list[TechniqueCard]:
    techniques = technique_service.get_all(
        session=session,
        position=position,
        type=type,
        difficulty=difficulty,
        q=q,
    )
    return [TechniqueCard.model_validate(t, from_attributes=True) for t in techniques]


@router.get("/{technique_id}", response_model=TechniqueDetail)
def get_technique(
    technique_id: int,
    session: Session = Depends(get_session),
) -> TechniqueDetail:
    result = technique_service.get_by_id(session=session, technique_id=technique_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Technique not found")

    outgoing = [
        RelationshipOut(
            relationship_type=r["relationship_type"],
            technique=TechniqueCard.model_validate(r["technique"], from_attributes=True),
        )
        for r in result["outgoing"]
    ]
    incoming = [
        RelationshipOut(
            relationship_type=r["relationship_type"],
            technique=TechniqueCard.model_validate(r["technique"], from_attributes=True),
        )
        for r in result["incoming"]
    ]

    return TechniqueDetail(
        id=result["id"],
        name=result["name"],
        position=result["position"],
        type=result["type"],
        difficulty=result["difficulty"],
        description=result["description"],
        steps=result["steps"],
        common_mistakes=result["common_mistakes"],
        counters=result["counters"],
        outgoing=outgoing,
        incoming=incoming,
    )
