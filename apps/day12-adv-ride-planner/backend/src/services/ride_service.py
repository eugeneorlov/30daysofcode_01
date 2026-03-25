"""Service layer for ride operations."""

from datetime import datetime
from typing import List, Optional

from sqlmodel import Session, select

from ..models.ride import Ride, RideCreate, RideCreateWithWaypoints, Waypoint, WaypointCreate


def create_ride(session: Session, data: RideCreateWithWaypoints) -> Ride:
    """Create ride with waypoints, setting order_index from list position."""
    # Create the ride first
    ride_data = data.model_dump(exclude={'waypoints'})
    ride = Ride(**ride_data)
    session.add(ride)
    session.commit()
    session.refresh(ride)

    # Create waypoints with order_index from list position
    for index, waypoint_data in enumerate(data.waypoints):
        waypoint = Waypoint(
            **waypoint_data.model_dump(exclude={'order_index'}),
            ride_id=ride.id,
            order_index=index
        )
        session.add(waypoint)

    session.commit()
    session.refresh(ride)
    return ride


def get_ride(session: Session, ride_id: int) -> Optional[Ride]:
    """Get ride with waypoints ordered by order_index."""
    statement = select(Ride).where(Ride.id == ride_id)
    ride = session.exec(statement).first()

    if ride:
        # Load waypoints ordered by order_index
        waypoints_statement = select(Waypoint).where(
            Waypoint.ride_id == ride_id
        ).order_by(Waypoint.order_index)
        waypoints = session.exec(waypoints_statement).all()
        ride.waypoints = list(waypoints)

    return ride


def list_rides(session: Session) -> List[dict]:
    """Return all rides with waypoint count, ordered by updated_at desc."""
    statement = select(Ride).order_by(Ride.updated_at.desc())
    rides = session.exec(statement).all()

    result = []
    for ride in rides:
        # Count waypoints for this ride
        waypoint_count_statement = select(Waypoint).where(Waypoint.ride_id == ride.id)
        waypoint_count = len(session.exec(waypoint_count_statement).all())

        ride_data = {
            "id": ride.id,
            "name": ride.name,
            "description": ride.description,
            "start_latitude": ride.start_latitude,
            "start_longitude": ride.start_longitude,
            "total_distance_km": ride.total_distance_km,
            "is_public": ride.is_public,
            "created_at": ride.created_at,
            "updated_at": ride.updated_at,
            "waypoint_count": waypoint_count
        }
        result.append(ride_data)

    return result


def update_ride(session: Session, ride_id: int, data: RideCreateWithWaypoints) -> Optional[Ride]:
    """Update ride and replace all waypoints (delete old, insert new)."""
    # Get existing ride
    statement = select(Ride).where(Ride.id == ride_id)
    ride = session.exec(statement).first()

    if not ride:
        return None

    # Update ride fields
    ride_data = data.model_dump(exclude={'waypoints'})
    for field, value in ride_data.items():
        setattr(ride, field, value)
    ride.updated_at = datetime.utcnow()

    # Delete old waypoints
    delete_statement = select(Waypoint).where(Waypoint.ride_id == ride_id)
    old_waypoints = session.exec(delete_statement).all()
    for waypoint in old_waypoints:
        session.delete(waypoint)

    session.commit()

    # Create new waypoints with order_index from list position
    for index, waypoint_data in enumerate(data.waypoints):
        waypoint = Waypoint(
            **waypoint_data.model_dump(exclude={'order_index'}),
            ride_id=ride.id,
            order_index=index
        )
        session.add(waypoint)

    session.commit()
    session.refresh(ride)
    return ride


def delete_ride(session: Session, ride_id: int) -> bool:
    """Delete ride and cascade delete waypoints."""
    # Get ride
    statement = select(Ride).where(Ride.id == ride_id)
    ride = session.exec(statement).first()

    if not ride:
        return False

    # Delete waypoints first (cascade)
    waypoints_statement = select(Waypoint).where(Waypoint.ride_id == ride_id)
    waypoints = session.exec(waypoints_statement).all()
    for waypoint in waypoints:
        session.delete(waypoint)

    # Delete ride
    session.delete(ride)
    session.commit()

    return True