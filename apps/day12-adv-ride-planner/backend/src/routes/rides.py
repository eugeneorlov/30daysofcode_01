"""API routes for ride operations."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from ..database import get_session
from ..models.ride import RideCreateWithWaypoints, RideListItem, RideOut, WaypointRead
from ..services import ride_service

router = APIRouter()


@router.post("/", response_model=RideOut, status_code=status.HTTP_201_CREATED)
async def create_ride(
    ride_data: RideCreateWithWaypoints,
    session: Session = Depends(get_session)
):
    """Create ride with waypoints."""
    ride = ride_service.create_ride(session, ride_data)

    # Convert waypoints to WaypointRead
    waypoints = [
        WaypointRead(
            id=wp.id,
            name=wp.name,
            description=wp.description,
            latitude=wp.latitude,
            longitude=wp.longitude,
            waypoint_type=wp.waypoint_type,
            order_index=wp.order_index,
            ride_id=wp.ride_id,
            created_at=wp.created_at
        ) for wp in ride.waypoints
    ]

    return RideOut(
        id=ride.id,
        name=ride.name,
        description=ride.description,
        start_latitude=ride.start_latitude,
        start_longitude=ride.start_longitude,
        total_distance_km=ride.total_distance_km,
        is_public=ride.is_public,
        created_at=ride.created_at,
        updated_at=ride.updated_at,
        waypoints=waypoints
    )


@router.get("/", response_model=List[RideListItem])
async def list_rides(session: Session = Depends(get_session)):
    """List all rides with waypoint count."""
    rides_data = ride_service.list_rides(session)
    return [RideListItem(**ride_data) for ride_data in rides_data]


@router.get("/{ride_id}", response_model=RideOut)
async def get_ride(ride_id: int, session: Session = Depends(get_session)):
    """Get ride with waypoints by ID."""
    ride = ride_service.get_ride(session, ride_id)

    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found"
        )

    # Convert waypoints to WaypointRead
    waypoints = [
        WaypointRead(
            id=wp.id,
            name=wp.name,
            description=wp.description,
            latitude=wp.latitude,
            longitude=wp.longitude,
            waypoint_type=wp.waypoint_type,
            order_index=wp.order_index,
            ride_id=wp.ride_id,
            created_at=wp.created_at
        ) for wp in ride.waypoints
    ]

    return RideOut(
        id=ride.id,
        name=ride.name,
        description=ride.description,
        start_latitude=ride.start_latitude,
        start_longitude=ride.start_longitude,
        total_distance_km=ride.total_distance_km,
        is_public=ride.is_public,
        created_at=ride.created_at,
        updated_at=ride.updated_at,
        waypoints=waypoints
    )


@router.put("/{ride_id}", response_model=RideOut)
async def update_ride(
    ride_id: int,
    ride_data: RideCreateWithWaypoints,
    session: Session = Depends(get_session)
):
    """Update ride and waypoints."""
    ride = ride_service.update_ride(session, ride_id, ride_data)

    if not ride:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found"
        )

    # Convert waypoints to WaypointRead
    waypoints = [
        WaypointRead(
            id=wp.id,
            name=wp.name,
            description=wp.description,
            latitude=wp.latitude,
            longitude=wp.longitude,
            waypoint_type=wp.waypoint_type,
            order_index=wp.order_index,
            ride_id=wp.ride_id,
            created_at=wp.created_at
        ) for wp in ride.waypoints
    ]

    return RideOut(
        id=ride.id,
        name=ride.name,
        description=ride.description,
        start_latitude=ride.start_latitude,
        start_longitude=ride.start_longitude,
        total_distance_km=ride.total_distance_km,
        is_public=ride.is_public,
        created_at=ride.created_at,
        updated_at=ride.updated_at,
        waypoints=waypoints
    )


@router.delete("/{ride_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ride(ride_id: int, session: Session = Depends(get_session)):
    """Delete ride by ID."""
    success = ride_service.delete_ride(session, ride_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}