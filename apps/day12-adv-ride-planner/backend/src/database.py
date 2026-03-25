from sqlmodel import SQLModel, Session, create_engine


# SQLite engine at ./rideplanner.db
engine = create_engine("sqlite:///./rideplanner.db", echo=True)


def create_db_and_tables():
    """Create database and tables."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get database session dependency."""
    with Session(engine) as session:
        yield session