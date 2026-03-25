"""Tests for ride API endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from src.database import get_session
from src.main import app


@pytest.fixture(name="session")
def session_fixture():
    """Create in-memory SQLite database session for testing."""
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
    """Create test client with test database session."""
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_create_ride(client: TestClient):
    """Test POST ride with 3 waypoints, verify 200, verify waypoints in response."""
    ride_data = {
        "name": "Test Alpine Loop",
        "description": "A scenic mountain ride for testing",
        "start_latitude": 46.5197,
        "start_longitude": 9.7907,
        "total_distance_km": 150.5,
        "is_public": True,
        "waypoints": [
            {
                "name": "Start Point",
                "description": "Beginning of our journey",
                "latitude": 46.5197,
                "longitude": 9.7907,
                "waypoint_type": "start",
                "order_index": 0
            },
            {
                "name": "Mountain Pass",
                "description": "Beautiful alpine pass",
                "latitude": 46.6197,
                "longitude": 9.8907,
                "waypoint_type": "scenic",
                "order_index": 1
            },
            {
                "name": "End Point",
                "description": "End of our journey",
                "latitude": 46.7197,
                "longitude": 9.9907,
                "waypoint_type": "end",
                "order_index": 2
            }
        ]
    }

    response = client.post("/api/rides/", json=ride_data)
    assert response.status_code == 201

    data = response.json()
    assert data["name"] == "Test Alpine Loop"
    assert data["description"] == "A scenic mountain ride for testing"
    assert len(data["waypoints"]) == 3

    # Verify waypoints are in correct order
    waypoints = sorted(data["waypoints"], key=lambda x: x["order_index"])
    assert waypoints[0]["waypoint_type"] == "start"
    assert waypoints[1]["waypoint_type"] == "scenic"
    assert waypoints[2]["waypoint_type"] == "end"


def test_get_ride(client: TestClient):
    """Test create then GET, verify all fields including waypoints ordered correctly."""
    # First create a ride
    ride_data = {
        "name": "Detailed Test Ride",
        "description": "Testing detailed ride retrieval",
        "start_latitude": 47.0,
        "start_longitude": 8.0,
        "total_distance_km": 200.0,
        "is_public": True,
        "waypoints": [
            {
                "name": "Point A",
                "description": "First waypoint",
                "latitude": 47.0,
                "longitude": 8.0,
                "waypoint_type": "start",
                "order_index": 0
            },
            {
                "name": "Point B",
                "description": "Second waypoint",
                "latitude": 47.1,
                "longitude": 8.1,
                "waypoint_type": "fuel",
                "order_index": 1
            },
            {
                "name": "Point C",
                "description": "Third waypoint",
                "latitude": 47.2,
                "longitude": 8.2,
                "waypoint_type": "end",
                "order_index": 2
            }
        ]
    }

    create_response = client.post("/api/rides/", json=ride_data)
    assert create_response.status_code == 201
    ride_id = create_response.json()["id"]

    # Now get the ride
    get_response = client.get(f"/api/rides/{ride_id}")
    assert get_response.status_code == 200

    data = get_response.json()
    assert data["id"] == ride_id
    assert data["name"] == "Detailed Test Ride"
    assert data["description"] == "Testing detailed ride retrieval"
    assert data["start_latitude"] == 47.0
    assert data["start_longitude"] == 8.0
    assert data["total_distance_km"] == 200.0
    assert data["is_public"] is True
    assert len(data["waypoints"]) == 3

    # Verify waypoints are ordered correctly by order_index
    waypoints = data["waypoints"]
    for i, waypoint in enumerate(waypoints):
        assert waypoint["order_index"] == i

    assert waypoints[0]["name"] == "Point A"
    assert waypoints[1]["name"] == "Point B"
    assert waypoints[2]["name"] == "Point C"


def test_list_rides(client: TestClient):
    """Test create 2 rides, GET list, verify 2 items with waypoint_count."""
    # Create first ride
    ride1_data = {
        "name": "Ride One",
        "description": "First test ride",
        "waypoints": [
            {
                "name": "Start",
                "latitude": 46.0,
                "longitude": 8.0,
                "waypoint_type": "start",
                "order_index": 0
            },
            {
                "name": "End",
                "latitude": 46.1,
                "longitude": 8.1,
                "waypoint_type": "end",
                "order_index": 1
            }
        ]
    }

    # Create second ride
    ride2_data = {
        "name": "Ride Two",
        "description": "Second test ride",
        "waypoints": [
            {
                "name": "Start",
                "latitude": 47.0,
                "longitude": 9.0,
                "waypoint_type": "start",
                "order_index": 0
            },
            {
                "name": "Middle",
                "latitude": 47.1,
                "longitude": 9.1,
                "waypoint_type": "scenic",
                "order_index": 1
            },
            {
                "name": "End",
                "latitude": 47.2,
                "longitude": 9.2,
                "waypoint_type": "end",
                "order_index": 2
            }
        ]
    }

    # Create both rides
    client.post("/api/rides/", json=ride1_data)
    client.post("/api/rides/", json=ride2_data)

    # Get list of rides
    response = client.get("/api/rides/")
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 2

    # Check waypoint counts
    rides_by_name = {ride["name"]: ride for ride in data}
    assert rides_by_name["Ride One"]["waypoint_count"] == 2
    assert rides_by_name["Ride Two"]["waypoint_count"] == 3


def test_update_ride(client: TestClient):
    """Test create ride, PUT with different waypoints, verify waypoints replaced."""
    # Create initial ride
    initial_data = {
        "name": "Original Ride",
        "description": "Original description",
        "waypoints": [
            {
                "name": "Old Start",
                "latitude": 46.0,
                "longitude": 8.0,
                "waypoint_type": "start",
                "order_index": 0
            },
            {
                "name": "Old End",
                "latitude": 46.1,
                "longitude": 8.1,
                "waypoint_type": "end",
                "order_index": 1
            }
        ]
    }

    create_response = client.post("/api/rides/", json=initial_data)
    assert create_response.status_code == 201
    ride_id = create_response.json()["id"]

    # Update with new data
    updated_data = {
        "name": "Updated Ride",
        "description": "Updated description",
        "start_latitude": 47.0,
        "start_longitude": 9.0,
        "total_distance_km": 300.0,
        "is_public": False,
        "waypoints": [
            {
                "name": "New Start",
                "description": "New starting point",
                "latitude": 47.0,
                "longitude": 9.0,
                "waypoint_type": "start",
                "order_index": 0
            },
            {
                "name": "New Middle",
                "description": "New middle point",
                "latitude": 47.1,
                "longitude": 9.1,
                "waypoint_type": "fuel",
                "order_index": 1
            },
            {
                "name": "New End",
                "description": "New ending point",
                "latitude": 47.2,
                "longitude": 9.2,
                "waypoint_type": "end",
                "order_index": 2
            }
        ]
    }

    update_response = client.put(f"/api/rides/{ride_id}", json=updated_data)
    assert update_response.status_code == 200

    data = update_response.json()
    assert data["id"] == ride_id
    assert data["name"] == "Updated Ride"
    assert data["description"] == "Updated description"
    assert len(data["waypoints"]) == 3

    # Verify old waypoints are replaced with new ones
    waypoints = sorted(data["waypoints"], key=lambda x: x["order_index"])
    assert waypoints[0]["name"] == "New Start"
    assert waypoints[1]["name"] == "New Middle"
    assert waypoints[2]["name"] == "New End"
    assert waypoints[1]["waypoint_type"] == "fuel"


def test_delete_ride(client: TestClient):
    """Test create ride, DELETE, verify 204, GET returns 404."""
    # Create a ride
    ride_data = {
        "name": "Ride to Delete",
        "description": "This ride will be deleted",
        "waypoints": [
            {
                "name": "Start",
                "latitude": 46.0,
                "longitude": 8.0,
                "waypoint_type": "start",
                "order_index": 0
            }
        ]
    }

    create_response = client.post("/api/rides/", json=ride_data)
    assert create_response.status_code == 201
    ride_id = create_response.json()["id"]

    # Delete the ride
    delete_response = client.delete(f"/api/rides/{ride_id}")
    assert delete_response.status_code == 204

    # Verify the ride is gone
    get_response = client.get(f"/api/rides/{ride_id}")
    assert get_response.status_code == 404


def test_ride_not_found(client: TestClient):
    """Test GET nonexistent id, verify 404."""
    response = client.get("/api/rides/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Ride not found"


def test_delete_nonexistent_ride(client: TestClient):
    """Test DELETE nonexistent ride returns 404."""
    response = client.delete("/api/rides/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Ride not found"


def test_update_nonexistent_ride(client: TestClient):
    """Test PUT nonexistent ride returns 404."""
    ride_data = {
        "name": "Does Not Exist",
        "waypoints": []
    }
    response = client.put("/api/rides/999", json=ride_data)
    assert response.status_code == 404
    assert response.json()["detail"] == "Ride not found"