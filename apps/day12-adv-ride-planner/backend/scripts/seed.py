"""Seed script for ADV ride planner with real Swiss/European routes."""

import os
import sys

# Add src to path to import our modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from src.database import create_db_and_tables, get_session
from src.models.ride import RideCreateWithWaypoints, WaypointCreate, WaypointType
from src.services import ride_service


def create_stelvio_pass_loop():
    """Create the Stelvio Pass Loop ride - road, moderate, ~6h, ~280km."""
    return RideCreateWithWaypoints(
        name="Stelvio Pass Loop",
        description="Epic road ride through one of Europe's highest paved mountain passes. This moderate 6-hour loop covers approximately 280km of stunning alpine scenery, featuring the legendary Stelvio Pass with its 48 hairpin turns.",
        start_latitude=46.4683,
        start_longitude=10.3708,
        total_distance_km=280.0,
        is_public=True,
        waypoints=[
            WaypointCreate(
                name="Bormio",
                description="Start: Historic spa town in the Italian Alps, gateway to Stelvio",
                latitude=46.4683,
                longitude=10.3708,
                waypoint_type=WaypointType.START,
                order_index=0
            ),
            WaypointCreate(
                name="Stelvio Pass Summit",
                description="Elevation 2757m - The crown jewel of alpine passes with breathtaking views",
                latitude=46.5285,
                longitude=10.4532,
                waypoint_type=WaypointType.SCENIC,
                order_index=1
            ),
            WaypointCreate(
                name="Prato allo Stelvio",
                description="Fuel stop in charming South Tyrolean village",
                latitude=46.6167,
                longitude=10.5833,
                waypoint_type=WaypointType.FUEL,
                order_index=2
            ),
            WaypointCreate(
                name="Umbrail Pass Viewpoint",
                description="Elevation 2501m - Spectacular photo opportunity with panoramic mountain views",
                latitude=46.5478,
                longitude=10.4331,
                waypoint_type=WaypointType.SCENIC,
                order_index=3
            ),
            WaypointCreate(
                name="Bormio",
                description="End: Return to starting point completing the loop",
                latitude=46.4683,
                longitude=10.3708,
                waypoint_type=WaypointType.END,
                order_index=4
            )
        ]
    )


def create_swiss_gravel_explorer():
    """Create the Swiss Gravel Explorer ride - gravel, challenging, ~4h, ~120km."""
    return RideCreateWithWaypoints(
        name="Swiss Gravel Explorer",
        description="Challenging 4-hour gravel adventure through the heart of the Swiss Alps. This 120km route combines technical gravel sections with stunning mountain scenery, featuring high alpine passes and traditional Swiss villages.",
        start_latitude=46.6863,
        start_longitude=7.8632,
        total_distance_km=120.0,
        is_public=True,
        waypoints=[
            WaypointCreate(
                name="Interlaken",
                description="Start: Beautiful lakeside town between Lake Thun and Lake Brienz",
                latitude=46.6863,
                longitude=7.8632,
                waypoint_type=WaypointType.START,
                order_index=0
            ),
            WaypointCreate(
                name="Grosse Scheidegg",
                description="Elevation 1962m - High mountain pass with challenging gravel sections",
                latitude=46.6558,
                longitude=8.1072,
                waypoint_type=WaypointType.SCENIC,
                order_index=1
            ),
            WaypointCreate(
                name="Grindelwald",
                description="Rest stop in picturesque alpine village below the Eiger",
                latitude=46.6244,
                longitude=8.0413,
                waypoint_type=WaypointType.FOOD,
                order_index=2
            ),
            WaypointCreate(
                name="Schwarzwaldalp",
                description="Elevation 1454m - Remote alpine location with technical terrain",
                latitude=46.6667,
                longitude=8.0833,
                waypoint_type=WaypointType.SCENIC,
                order_index=3
            ),
            WaypointCreate(
                name="Meiringen",
                description="End: Historic town famous for Sherlock Holmes and alpine railways",
                latitude=46.7275,
                longitude=8.1872,
                waypoint_type=WaypointType.END,
                order_index=4
            )
        ]
    )


def create_black_forest_offroad():
    """Create the Black Forest Offroad ride - offroad, expert, ~8h, ~190km."""
    return RideCreateWithWaypoints(
        name="Black Forest Offroad",
        description="Expert-level 8-hour offroad expedition through Germany's legendary Black Forest. This demanding 190km route features challenging single tracks, forest trails, and steep technical sections through dense woodland and alpine terrain.",
        start_latitude=47.9990,
        start_longitude=7.8421,
        total_distance_km=190.0,
        is_public=True,
        waypoints=[
            WaypointCreate(
                name="Freiburg",
                description="Start: Historic university city at the edge of the Black Forest",
                latitude=47.9990,
                longitude=7.8421,
                waypoint_type=WaypointType.START,
                order_index=0
            ),
            WaypointCreate(
                name="Titisee",
                description="Fuel stop at famous glacial lake with tourist facilities",
                latitude=47.8953,
                longitude=8.1564,
                waypoint_type=WaypointType.FUEL,
                order_index=1
            ),
            WaypointCreate(
                name="Feldberg Summit Trail",
                description="Elevation 1493m - Highest peak in Black Forest with challenging offroad access",
                latitude=47.8582,
                longitude=8.0038,
                waypoint_type=WaypointType.SCENIC,
                order_index=2
            ),
            WaypointCreate(
                name="Schluchsee Lakeshore",
                description="Camping spot by beautiful high-altitude reservoir",
                latitude=47.8178,
                longitude=8.1847,
                waypoint_type=WaypointType.HOTEL,
                order_index=3
            ),
            WaypointCreate(
                name="Wutach Gorge Overlook",
                description="Spectacular photo opportunity over dramatic river gorge",
                latitude=47.8333,
                longitude=8.3333,
                waypoint_type=WaypointType.SCENIC,
                order_index=4
            ),
            WaypointCreate(
                name="Freiburg",
                description="End: Return to starting point after epic offroad adventure",
                latitude=47.9990,
                longitude=7.8421,
                waypoint_type=WaypointType.END,
                order_index=5
            )
        ]
    )


def seed_database():
    """Seed the database with the three ADV routes."""
    # Create database and tables
    create_db_and_tables()

    # Get database session
    session = next(get_session())

    try:
        # Create the three rides
        rides = [
            create_stelvio_pass_loop(),
            create_swiss_gravel_explorer(),
            create_black_forest_offroad()
        ]

        created_rides = []
        for ride_data in rides:
            ride = ride_service.create_ride(session, ride_data)
            created_rides.append(ride)
            print(f"✅ Created ride: {ride.name} (ID: {ride.id})")

        print(f"\n🎉 Successfully seeded {len(created_rides)} ADV routes!")
        print("\nCreated routes:")
        for ride in created_rides:
            print(f"  - {ride.name}: {len(ride.waypoints)} waypoints, {ride.total_distance_km}km")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    print("🌱 Seeding ADV Ride Planner database with European routes...")
    seed_database()