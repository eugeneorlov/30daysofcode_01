from typing import Optional

from sqlalchemy import JSON
from sqlmodel import Column, Field, SQLModel


class Technique(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    position: str
    type: str
    difficulty: str
    description: str
    steps: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    common_mistakes: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    counters: list[str] = Field(default_factory=list, sa_column=Column(JSON))


class TechniqueRelationship(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    from_technique_id: int = Field(foreign_key="technique.id", index=True)
    to_technique_id: int = Field(foreign_key="technique.id", index=True)
    relationship_type: str
