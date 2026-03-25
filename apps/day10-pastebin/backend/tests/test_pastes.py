import os
import tempfile
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session

from src.main import app
from src.database import get_session


@pytest.fixture(scope="function")
def test_engine():
    """Create a temporary SQLite database engine for testing."""
    # Create a temporary file for the test database
    db_fd, db_path = tempfile.mkstemp(suffix='.db')
    os.close(db_fd)

    engine = create_engine(
        f"sqlite:///{db_path}",
        echo=False,
        connect_args={"check_same_thread": False}
    )
    SQLModel.metadata.create_all(engine)

    yield engine

    # Cleanup: remove the temporary database file
    try:
        os.unlink(db_path)
    except OSError:
        pass


@pytest.fixture
def client(test_engine):
    """Create a TestClient with test database session override."""
    def get_session_override():
        session = Session(test_engine)
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_create_paste(client):
    """Test creating a new paste - POST, verify 200, verify short_id in response."""
    paste_data = {
        "content": "print('Hello, World!')",
        "title": "Test Paste",
        "language": "python"
    }

    response = client.post("/api/pastes/", json=paste_data)

    assert response.status_code == 200
    data = response.json()

    # Verify short_id is in response and has correct format
    assert "short_id" in data
    assert isinstance(data["short_id"], str)
    assert len(data["short_id"]) > 0

    # Verify other fields
    assert data["content"] == paste_data["content"]
    assert data["title"] == paste_data["title"]
    assert data["language"] == paste_data["language"]
    assert data["view_count"] == 0


def test_get_paste(client):
    """Test getting a paste - create then GET by short_id, verify content matches."""
    # First create a paste
    paste_data = {
        "content": "console.log('Hello from JS');",
        "title": "JavaScript Example",
        "language": "javascript"
    }

    create_response = client.post("/api/pastes/", json=paste_data)
    assert create_response.status_code == 200
    created_paste = create_response.json()
    short_id = created_paste["short_id"]

    # Now get the paste by short_id
    get_response = client.get(f"/api/pastes/{short_id}")

    assert get_response.status_code == 200
    retrieved_paste = get_response.json()

    # Verify content matches
    assert retrieved_paste["content"] == paste_data["content"]
    assert retrieved_paste["title"] == paste_data["title"]
    assert retrieved_paste["language"] == paste_data["language"]
    assert retrieved_paste["short_id"] == short_id
    # View count should be incremented
    assert retrieved_paste["view_count"] == 1


def test_list_recent(client):
    """Test listing recent pastes - create 3 pastes, GET /recent, verify 3 items returned, no content field."""
    # Create 3 test pastes
    paste_data_list = [
        {"content": "SELECT * FROM users;", "title": "SQL Query", "language": "sql"},
        {"content": "#!/bin/bash\necho 'Hello World'", "title": "Bash Script", "language": "bash"},
        {"content": "This is plain text", "title": "Text Note", "language": "plaintext"}
    ]

    created_short_ids = []
    for paste_data in paste_data_list:
        response = client.post("/api/pastes/", json=paste_data)
        assert response.status_code == 200
        created_short_ids.append(response.json()["short_id"])

    # Get recent pastes
    response = client.get("/api/pastes/recent")

    assert response.status_code == 200
    pastes = response.json()

    # Verify 3 items returned
    assert len(pastes) == 3

    # Verify no content field in list items
    for paste in pastes:
        assert "content" not in paste
        assert "short_id" in paste
        assert "title" in paste
        assert "language" in paste
        assert "created_at" in paste
        assert "view_count" in paste

        # Verify it's one of our created pastes
        assert paste["short_id"] in created_short_ids


def test_paste_not_found(client):
    """Test getting nonexistent paste - GET nonexistent short_id, verify 404."""
    nonexistent_short_id = "nonexist"

    response = client.get(f"/api/pastes/{nonexistent_short_id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Paste not found or expired"


def test_health(client):
    """Test health endpoint - GET /, verify 200."""
    response = client.get("/")

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Pastebin API is running"