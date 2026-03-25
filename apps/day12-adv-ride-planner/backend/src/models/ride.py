"""SQLModel models for rides and waypoints."""

from datetime import datetime
from enum import Enum
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class WaypointType(str, Enum):
    """Types of waypoints in a ride."""
    START = "start"
    STOP = "stop"
    END = "end"
    SCENIC = "scenic"
    FUEL = "fuel"
    FOOD = "food"
    HOTEL = "hotel"


class RideBase(SQLModel):
    """Base ride model with common fields."""
    name: str = Field(max_length=100, description="Name of the ride")
    description: Optional[str] = Field(default=None, max_length=1000, description="Description of the ride")
    start_latitude: Optional[float] = Field(default=None, description="Starting latitude")
    start_longitude: Optional[float] = Field(default=None, description="Starting longitude")
    total_distance_km: Optional[float] = Field(default=None, ge=0, description="Total distance in kilometers")
    is_public: bool = Field(default=True, description="Whether the ride is publicly visible")


class Ride(RideBase, table=True):
    """Ride model representing a motorcycle/adventure ride route."""

    __tablename__ = "rides"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, description="When the ride was created")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="When the ride was last updated")

    # Relationship to waypoints
    waypoints: List["Waypoint"] = Relationship(back_populates="ride")


class WaypointBase(SQLModel):
    """Base waypoint model with common fields."""
    name: str = Field(max_length=100, description="Name of the waypoint")
    description: Optional[str] = Field(default=None, max_length=500, description="Description of the waypoint")
    latitude: float = Field(description="Latitude coordinate")
    longitude: float = Field(description="Longitude coordinate")
    waypoint_type: WaypointType = Field(default=WaypointType.STOP, description="Type of waypoint")
    order_index: int = Field(ge=0, description="Order of this waypoint in the ride sequence")


class Waypoint(WaypointBase, table=True):
    """Waypoint model representing a point along a ride route."""

    __tablename__ = "waypoints"

    id: Optional[int] = Field(default=None, primary_key=True)
    ride_id: int = Field(foreign_key="rides.id", description="ID of the associated ride")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="When the waypoint was created")

    # Relationship to ride
    ride: Optional[Ride] = Relationship(back_populates="waypoints")


# API response models
class RideCreate(RideBase):
    """Model for creating a new ride."""
    pass


class RideRead(RideBase):
    """Model for reading a ride with its ID and timestamps."""
    id: int
    created_at: datetime
    updated_at: datetime


class RideUpdate(SQLModel):
    """Model for updating a ride."""
    name: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)
    start_latitude: Optional[float] = Field(default=None)
    start_longitude: Optional[float] = Field(default=None)
    total_distance_km: Optional[float] = Field(default=None, ge=0)
    is_public: Optional[bool] = Field(default=None)


class WaypointCreate(WaypointBase):
    """Model for creating a new waypoint."""
    pass


class WaypointRead(WaypointBase):
    """Model for reading a waypoint with its ID and timestamps."""
    id: int
    ride_id: int
    created_at: datetime


class WaypointUpdate(SQLModel):
    """Model for updating a waypoint."""
    name: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    waypoint_type: Optional[WaypointType] = Field(default=None)
    order_index: Optional[int] = Field(default=None, ge=0)