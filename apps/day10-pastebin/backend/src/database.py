from sqlmodel import SQLModel, create_engine, Session
from typing import Generator

# SQLite engine at ./pastebin.db
engine = create_engine("sqlite:///./pastebin.db", echo=True)


def create_db_and_tables():
    """Create database and tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Dependency to get database session."""
    with Session(engine) as session:
        yield session