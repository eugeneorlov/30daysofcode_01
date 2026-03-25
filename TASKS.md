## T1: Scaffold ride planner backend
- STATUS: done
- FILES: apps/day12-adv-ride-planner/backend/
- VERIFY: cd apps/day12-adv-ride-planner/backend && uv run python -c "import fastapi; import sqlmodel; print('OK')"
- CRITIC: skip
- PUSH: gate
- SPEC: Create apps/day12-adv-ride-planner/backend/ directory structure.
  Run `uv init` inside it. Add dependencies: fastapi, sqlmodel, uvicorn.
  Create these files:
  - src/__init__.py (empty)
  - src/main.py — FastAPI app with CORS (allow localhost:5173), mount routes, call create_db_and_tables on startup
  - src/database.py — SQLite engine at ./rideplanner.db, create_db_and_tables function, get_session dependency
  - .python-version — set to 3.12
  Do NOT create models or routes yet. Just the skeleton that starts with `uv run uvicorn src.main:app`.

## T2: Define SQLModel models
- STATUS: done
- FILES: apps/day12-adv-ride-planner/backend/src/models/ride.py
- VERIFY: cd apps/day12-adv-ride-planner/backend && uv run python -c "from src.models.ride import Ride, Waypoint; print(Ride.__tablename__, Waypoint.__tablename__)"
- CRITIC: skip
- PUSH: gate
- SPEC: Create src/models/__init__.py and src/models/ride.py.
  Define these SQLModel tables:

  Ride:
    - id: int, PK, auto-increment
    - name: str, required (e.g. "Alps Adventure Loop")
    - description: str, optional
    - terrain: str, default "mixed" — enum values: road, gravel, offroad, mixed
    - difficulty: str, default "moderate" — enum values: easy, moderate, challenging, expert
    - estimated_hours: float, optional
    - total_distance_km: float, optional
    - created_at: datetime, default utcnow
    - updated_at: datetime, default utcnow, update on change

  Waypoint:
    - id: int, PK, auto-increment
    - ride_id: int, FK -> Ride, required
    - order_index: int, required (0-based position in route)
    - name: str, required (e.g. "Stelvio Pass Summit")
    - lat: float, required
    - lng: float, required
    - waypoint_type: str, default "waypoint" — enum values: start, waypoint, fuel, rest, photo, camping, end
    - notes: str, optional
    - elevation_m: int, optional

  Pydantic schemas in the same file:
    - WaypointCreate(BaseModel): name, lat, lng, waypoint_type, notes (optional), elevation_m (optional)
    - WaypointOut(BaseModel): all Waypoint fields
    - RideCreate(BaseModel): name, description (optional), terrain, difficulty, estimated_hours (optional), total_distance_km (optional), waypoints: list[WaypointCreate]
    - RideOut(BaseModel): all Ride fields + waypoints: list[WaypointOut], ordered by order_index
    - RideListItem(BaseModel): id, name, terrain, difficulty, estimated_hours, total_distance_km, created_at, waypoint_count: int

## T3: Implement ride service and routes
- STATUS: pending
- FILES: apps/day12-adv-ride-planner/backend/src/services/ride_service.py, apps/day12-adv-ride-planner/backend/src/routes/rides.py
- VERIFY: cd apps/day12-adv-ride-planner/backend && uv run python -c "from src.routes.rides import router; print(len(router.routes))"
- CRITIC: skip
- PUSH: gate
- SPEC: Create src/services/__init__.py, src/services/ride_service.py, src/routes/__init__.py, src/routes/rides.py.
  Service functions:
    - create_ride(session, data: RideCreate) -> Ride — create ride + all waypoints with order_index set from list position
    - get_ride(session, ride_id: int) -> Ride | None — include waypoints ordered by order_index
    - list_rides(session) -> list — return all rides with waypoint count, ordered by updated_at desc
    - update_ride(session, ride_id: int, data: RideCreate) -> Ride | None — replace all waypoints (delete old, insert new)
    - delete_ride(session, ride_id: int) -> bool — cascade delete waypoints
  Routes (prefix /api/rides):
    - POST / — create ride with waypoints, return RideOut
    - GET / — list all rides, return list[RideListItem]
    - GET /{ride_id} — get ride with waypoints, return RideOut, 404 if not found
    - PUT /{ride_id} — update ride and waypoints, return RideOut, 404 if not found
    - DELETE /{ride_id} — delete ride, return 204
    - GET /health — return {"status": "ok"}
  Wire the router into main.py with prefix /api/rides.

## T4: Write backend tests and seed data
- STATUS: pending
- FILES: apps/day12-adv-ride-planner/backend/tests/test_rides.py, apps/day12-adv-ride-planner/backend/scripts/seed.py
- VERIFY: cd apps/day12-adv-ride-planner/backend && uv run pytest tests/ -v && uv run python scripts/seed.py
- CRITIC: skip
- PUSH: gate
- SPEC: Create tests/__init__.py and tests/test_rides.py.
  Use FastAPI TestClient with in-memory SQLite override for session dependency.
  Tests:
    - test_create_ride — POST ride with 3 waypoints, verify 200, verify waypoints in response
    - test_get_ride — create then GET, verify all fields including waypoints ordered correctly
    - test_list_rides — create 2 rides, GET list, verify 2 items with waypoint_count
    - test_update_ride — create ride, PUT with different waypoints, verify waypoints replaced
    - test_delete_ride — create ride, DELETE, verify 204, GET returns 404
    - test_ride_not_found — GET nonexistent id, verify 404
  Create scripts/seed.py — seed 3 rides with real Swiss/European ADV routes:
  Ride 1 - "Stelvio Pass Loop" (road, moderate, ~6h, ~280km):
    - Start: Bormio (46.4683, 10.3708)
    - Waypoint: Stelvio Pass Summit (46.5285, 10.4532, elevation 2757m)
    - Fuel: Prato allo Stelvio (46.6167, 10.5833)
    - Photo: Umbrail Pass viewpoint (46.5478, 10.4331, elevation 2501m)
    - End: Bormio
  Ride 2 - "Swiss Gravel Explorer" (gravel, challenging, ~4h, ~120km):
    - Start: Interlaken (46.6863, 7.8632)
    - Waypoint: Grosse Scheidegg (46.6558, 8.1072, elevation 1962m)
    - Rest: Grindelwald (46.6244, 8.0413)
    - Waypoint: Schwarzwaldalp (46.6667, 8.0833, elevation 1454m)
    - End: Meiringen (46.7275, 8.1872)
  Ride 3 - "Black Forest Offroad" (offroad, expert, ~8h, ~190km):
    - Start: Freiburg (47.9990, 7.8421)
    - Fuel: Titisee (47.8953, 8.1564)
    - Waypoint: Feldberg Summit Trail (47.8582, 8.0038, elevation 1493m)
    - Camping: Schluchsee Lakeshore (47.8178, 8.1847)
    - Photo: Wutach Gorge Overlook (47.8333, 8.3333)
    - End: Freiburg

## T5: Scaffold ride planner frontend
- STATUS: done
- FILES: apps/day12-adv-ride-planner/frontend/
- VERIFY: cd apps/day12-adv-ride-planner/frontend && pnpm build
- CRITIC: skip
- PUSH: gate
- SPEC: Create apps/day12-adv-ride-planner/frontend/ using Vite React template.
  Run: cd apps/day12-adv-ride-planner && pnpm create vite frontend -- --template react
  Then:
    - cd frontend && pnpm install
    - pnpm add react-router-dom leaflet react-leaflet
    - pnpm add -D tailwindcss @tailwindcss/vite
  Configure:
    - vite.config.js: add tailwind plugin, add proxy: "/api" -> "http://localhost:8000"
    - src/index.css: add @import "tailwindcss" at top. Also add: @import "leaflet/dist/leaflet.css";
    - package.json: set "name": "day12-adv-ride-planner-frontend"
  Create minimal App.jsx with React Router:
    - "/" -> RideListPage (placeholder div)
    - "/ride/new" -> RideEditorPage (placeholder div)
    - "/ride/:id" -> RideDetailPage (placeholder div)
    - "/ride/:id/edit" -> RideEditorPage (placeholder div)
  Fix Leaflet default marker icon issue — add this to main.jsx:
  ```
  import L from 'leaflet';
  import markerIcon from 'leaflet/dist/images/marker-icon.png';
  import markerShadow from 'leaflet/dist/images/marker-shadow.png';
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow });
  ```
  Verify: pnpm build completes without errors.

## T6: Build RideEditorPage — create/edit ride with map
- STATUS: pending
- FILES: apps/day12-adv-ride-planner/frontend/src/pages/RideEditorPage.jsx, apps/day12-adv-ride-planner/frontend/src/components/RouteMap.jsx, apps/day12-adv-ride-planner/frontend/src/components/WaypointList.jsx
- VERIFY: cd apps/day12-adv-ride-planner/frontend && pnpm build
- CRITIC: skip
- PUSH: gate
- SPEC: Create RideEditorPage.jsx, RouteMap.jsx, and WaypointList.jsx.
  RouteMap component:
    - Props: waypoints (array), onMapClick (callback with {lat, lng}), selectedIndex (int|null)
    - Render a Leaflet MapContainer, center on Europe (46.8, 8.2, zoom 7) or on first waypoint if exists
    - Show markers for each waypoint. Color markers by type: start=green, end=red, fuel=orange, rest=blue, photo=purple, camping=yellow, waypoint=gray. Use Leaflet divIcon with colored circles (no external icon files).
    - Draw polyline connecting waypoints in order (dashed, blue)
    - On map click: call onMapClick with lat/lng
    - When selectedIndex changes, pan map to that waypoint
    - Map height: 400px on desktop, 300px on mobile
  WaypointList component:
    - Props: waypoints (array), onUpdate (callback), onDelete (callback with index), onReorder (callback)
    - Render ordered list of waypoints with: drag handle, name input, type dropdown, notes input, lat/lng display (readonly, 4 decimals), delete button
    - Reorder via up/down arrow buttons (no drag library needed)
  RideEditorPage:
    - If URL has :id param, fetch existing ride and populate form (edit mode). Otherwise blank (create mode).
    - Form fields: name (required), description (textarea), terrain dropdown, difficulty dropdown, estimated_hours input, total_distance_km input
    - RouteMap + WaypointList side by side on desktop (grid-cols-2), stacked on mobile
    - Clicking the map adds a new waypoint at that position with auto-name "Waypoint N"
    - Save button: POST (create) or PUT (edit) to API, navigate to /ride/:id on success
    - Cancel button: navigate back to /
  Style: dark theme bg-gray-950, card sections with bg-gray-900 rounded-lg p-4.

## T7: Build RideDetailPage — view ride with full map
- STATUS: pending
- FILES: apps/day12-adv-ride-planner/frontend/src/pages/RideDetailPage.jsx, apps/day12-adv-ride-planner/frontend/src/components/RideStats.jsx
- VERIFY: cd apps/day12-adv-ride-planner/frontend && pnpm build
- CRITIC: skip
- PUSH: gate
- SPEC: Create RideDetailPage.jsx and RideStats.jsx.
  RideStats component:
    - Props: ride (RideOut from API)
    - Display in a horizontal row of stat cards: terrain badge, difficulty badge, distance (km), estimated time (hours), waypoint count
    - Badge colors: terrain (road=blue, gravel=amber, offroad=red, mixed=purple), difficulty (easy=green, moderate=yellow, challenging=orange, expert=red)
  RideDetailPage:
    - Fetch ride from /api/rides/:id on mount
    - Show loading spinner while fetching
    - Show 404 message if not found
    - Display: ride name as h1, description, RideStats row
    - Full-width RouteMap showing all waypoints (non-interactive, no onMapClick). Reuse RouteMap component but pass onMapClick as null/undefined. Map should be taller here: 500px.
    - Waypoint table below the map: columns = #, Name, Type badge, Elevation, Notes
    - Action buttons: "Edit Ride" (link to /ride/:id/edit), "Delete" (confirm dialog then DELETE, navigate to /), "Back to Rides" (link to /)
  Style: same dark theme, max-w-6xl container centered.

## T8: Build RideListPage — browse all rides
- STATUS: pending
- FILES: apps/day12-adv-ride-planner/frontend/src/pages/RideListPage.jsx, apps/day12-adv-ride-planner/frontend/src/components/RideCard.jsx
- VERIFY: cd apps/day12-adv-ride-planner/frontend && pnpm build
- CRITIC: skip
- PUSH: gate
- SPEC: Create RideListPage.jsx and RideCard.jsx.
  RideCard component:
    - Props: ride (RideListItem from API)
    - Card layout: ride name, terrain badge, difficulty badge, distance, estimated time, waypoint count, created date
    - Entire card is a link to /ride/:id
    - Hover: ring-1 ring-amber-500/50 transition
  RideListPage:
    - Fetch rides from /api/rides on mount
    - Header: "ADV Ride Planner" title with motorcycle emoji + "Plan Ride" button (link to /ride/new)
    - Grid of RideCards: 1 col on mobile, 2 on md, 3 on lg
    - Loading state while fetching
    - Empty state: "No rides planned yet. Start your first adventure!" with link to /ride/new
  Add navigation bar in App.jsx:
    - Left: "ADV Ride Planner" title with motorcycle emoji (link to /)
    - Right: "Plan Ride" button (link to /ride/new)
    - Dark background: bg-gray-900, amber accent for buttons (bg-amber-600 hover:bg-amber-500)
  Style: dark theme, amber/orange accent color for ADV feel.

## T9: Write frontend tests
- STATUS: pending
- FILES: apps/day12-adv-ride-planner/frontend/src/__tests__/
- VERIFY: cd apps/day12-adv-ride-planner/frontend && pnpm test -- --run
- CRITIC: skip
- PUSH: gate
- SPEC: Set up Vitest with React Testing Library.
  Add vitest config to vite.config.js (test: { environment: 'jsdom', globals: true, setupFiles: './src/setupTests.js' }).
  Add to devDependencies: vitest, jsdom, @testing-library/react, @testing-library/jest-dom.
  Create src/setupTests.js with: import '@testing-library/jest-dom'.
  Add "test": "vitest" to package.json scripts.
  Create src/__tests__/RideCard.test.jsx:
    - Renders ride name and terrain badge
    - Links to correct ride URL
  Create src/__tests__/RideStats.test.jsx:
    - Renders distance and time
    - Shows correct badge colors for terrain/difficulty
  Create src/__tests__/WaypointList.test.jsx:
    - Renders waypoint names
    - Calls onDelete when delete button clicked
  Note: do NOT test RouteMap (Leaflet requires DOM mocking that's too complex for this scope).

## T10: Polish and update README
- STATUS: pending
- FILES: apps/day12-adv-ride-planner/frontend/src/App.jsx, README.md
- VERIFY: cd apps/day12-adv-ride-planner/frontend && pnpm build && cd ../../ && grep "day12" README.md
- CRITIC: skip
- PUSH: gate
- SPEC: Final polish pass:
  1. In App.jsx: use OpenStreetMap tile URL in all maps — verify the attribution text "© OpenStreetMap contributors" appears. The tile URL is: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
  2. In RideDetailPage: format created_at as "March 25, 2026"
  3. In RideListPage: format created_at as relative time ("3 hours ago", "2 days ago") — write a simple helper function, no external library
  4. In RideEditorPage: auto-focus the name input on mount
  5. Add a footer in App.jsx: "Built as part of 30 Days of Code" in small text
  6. Update root README.md: change "12-13 | ADV Ride Planner" status from 🔲 to ✅
  Do NOT modify any other apps or files outside of apps/day12-adv-ride-planner/ and README.md.
