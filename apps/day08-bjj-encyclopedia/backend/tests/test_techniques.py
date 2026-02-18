"""Tests for the BJJ Technique Encyclopedia API."""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from src.database import get_session
from src.main import app
from src.models.technique import Technique, TechniqueRelationship


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def _seed_techniques(session: Session) -> list[Technique]:
    t1 = Technique(
        name="Armbar from Guard",
        position="Guard",
        type="Submission",
        difficulty="Beginner",
        description="A fundamental armbar applied from the guard position.",
        steps=["Step 1", "Step 2"],
        common_mistakes=["Mistake 1"],
        counters=["Counter 1"],
    )
    t2 = Technique(
        name="Triangle Choke",
        position="Guard",
        type="Submission",
        difficulty="Intermediate",
        description="A blood choke using the legs to form a triangle.",
        steps=["Step 1", "Step 2"],
        common_mistakes=["Mistake 1"],
        counters=["Counter 1"],
    )
    t3 = Technique(
        name="Double Leg Takedown",
        position="Standing",
        type="Transition",
        difficulty="Beginner",
        description="A wrestling takedown that shoots for both legs.",
        steps=["Step 1", "Step 2"],
        common_mistakes=["Mistake 1"],
        counters=["Counter 1"],
    )
    session.add(t1)
    session.add(t2)
    session.add(t3)
    session.flush()

    rel = TechniqueRelationship(
        from_technique_id=t1.id,  # type: ignore[arg-type]
        to_technique_id=t2.id,  # type: ignore[arg-type]
        relationship_type="leads_to",
    )
    session.add(rel)
    session.commit()

    session.refresh(t1)
    session.refresh(t2)
    session.refresh(t3)
    return [t1, t2, t3]


class TestHealthEndpoint:
    def test_health_returns_ok(self, client: TestClient):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestListTechniques:
    def test_returns_empty_list_when_no_data(self, client: TestClient):
        response = client.get("/techniques")
        assert response.status_code == 200
        assert response.json() == []

    def test_returns_all_techniques(self, client: TestClient, session: Session):
        _seed_techniques(session)
        response = client.get("/techniques")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3

    def test_response_contains_expected_fields(self, client: TestClient, session: Session):
        _seed_techniques(session)
        response = client.get("/techniques")
        assert response.status_code == 200
        item = response.json()[0]
        assert "id" in item
        assert "name" in item
        assert "position" in item
        assert "type" in item
        assert "difficulty" in item
        assert "description" in item
        # TechniqueCard should NOT include steps/common_mistakes
        assert "steps" not in item
        assert "common_mistakes" not in item

    def test_filter_by_position(self, client: TestClient, session: Session):
        _seed_techniques(session)
        response = client.get("/techniques?position=Guard")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        for item in data:
            assert item["position"] == "Guard"

    def test_filter_by_type(self, client: TestClient, session: Session):
        _seed_techniques(session)
        response = client.get("/techniques?type=Submission")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        for item in data:
            assert item["type"] == "Submission"

    def test_filter_by_difficulty(self, client: TestClient, session: Session):
        _seed_techniques(session)
        response = client.get("/techniques?difficulty=Beginner")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        for item in data:
            assert item["difficulty"] == "Beginner"

    def test_filter_by_position_no_match(self, client: TestClient, session: Session):
        _seed_techniques(session)
        response = client.get("/techniques?position=Mount")
        assert response.status_code == 200
        assert response.json() == []

    def test_search_by_name(self, client: TestClient, session: Session):
        _seed_techniques(session)
        response = client.get("/techniques?q=armbar")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Armbar from Guard"

    def test_search_by_description(self, client: TestClient, session: Session):
        _seed_techniques(session)
        response = client.get("/techniques?q=wrestling")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Double Leg Takedown"

    def test_combined_filters(self, client: TestClient, session: Session):
        _seed_techniques(session)
        response = client.get("/techniques?position=Guard&difficulty=Beginner")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Armbar from Guard"


class TestGetTechnique:
    def test_returns_technique_detail(self, client: TestClient, session: Session):
        techniques = _seed_techniques(session)
        t1_id = techniques[0].id
        response = client.get(f"/techniques/{t1_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == t1_id
        assert data["name"] == "Armbar from Guard"

    def test_detail_includes_steps_and_mistakes(self, client: TestClient, session: Session):
        techniques = _seed_techniques(session)
        t1_id = techniques[0].id
        response = client.get(f"/techniques/{t1_id}")
        assert response.status_code == 200
        data = response.json()
        assert "steps" in data
        assert "common_mistakes" in data
        assert "counters" in data
        assert isinstance(data["steps"], list)
        assert len(data["steps"]) == 2

    def test_detail_includes_outgoing_relationships(self, client: TestClient, session: Session):
        techniques = _seed_techniques(session)
        t1_id = techniques[0].id
        response = client.get(f"/techniques/{t1_id}")
        assert response.status_code == 200
        data = response.json()
        assert "outgoing" in data
        assert len(data["outgoing"]) == 1
        assert data["outgoing"][0]["relationship_type"] == "leads_to"
        assert data["outgoing"][0]["technique"]["name"] == "Triangle Choke"

    def test_detail_includes_incoming_relationships(self, client: TestClient, session: Session):
        techniques = _seed_techniques(session)
        t2_id = techniques[1].id
        response = client.get(f"/techniques/{t2_id}")
        assert response.status_code == 200
        data = response.json()
        assert "incoming" in data
        assert len(data["incoming"]) == 1
        assert data["incoming"][0]["relationship_type"] == "leads_to"
        assert data["incoming"][0]["technique"]["name"] == "Armbar from Guard"

    def test_technique_with_no_relationships(self, client: TestClient, session: Session):
        techniques = _seed_techniques(session)
        t3_id = techniques[2].id
        response = client.get(f"/techniques/{t3_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["outgoing"] == []
        assert data["incoming"] == []

    def test_returns_404_for_nonexistent_technique(self, client: TestClient):
        response = client.get("/techniques/9999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Technique not found"
