from typing import Optional

from sqlmodel import Session, select

from src.models.technique import Technique, TechniqueRelationship


def get_all(
    session: Session,
    position: Optional[str] = None,
    type: Optional[str] = None,
    difficulty: Optional[str] = None,
    q: Optional[str] = None,
) -> list[Technique]:
    statement = select(Technique)

    if position:
        statement = statement.where(Technique.position == position)
    if type:
        statement = statement.where(Technique.type == type)
    if difficulty:
        statement = statement.where(Technique.difficulty == difficulty)
    if q:
        search = f"%{q}%"
        statement = statement.where(
            Technique.name.ilike(search) | Technique.description.ilike(search)
        )

    return list(session.exec(statement).all())


def get_by_id(session: Session, technique_id: int) -> Optional[dict]:
    technique = session.get(Technique, technique_id)
    if technique is None:
        return None

    outgoing_rels = session.exec(
        select(TechniqueRelationship).where(
            TechniqueRelationship.from_technique_id == technique_id
        )
    ).all()

    incoming_rels = session.exec(
        select(TechniqueRelationship).where(
            TechniqueRelationship.to_technique_id == technique_id
        )
    ).all()

    outgoing = []
    for rel in outgoing_rels:
        neighbor = session.get(Technique, rel.to_technique_id)
        if neighbor:
            outgoing.append({"relationship_type": rel.relationship_type, "technique": neighbor})

    incoming = []
    for rel in incoming_rels:
        neighbor = session.get(Technique, rel.from_technique_id)
        if neighbor:
            incoming.append({"relationship_type": rel.relationship_type, "technique": neighbor})

    return {
        "id": technique.id,
        "name": technique.name,
        "position": technique.position,
        "type": technique.type,
        "difficulty": technique.difficulty,
        "description": technique.description,
        "steps": technique.steps,
        "common_mistakes": technique.common_mistakes,
        "counters": technique.counters,
        "outgoing": outgoing,
        "incoming": incoming,
    }
