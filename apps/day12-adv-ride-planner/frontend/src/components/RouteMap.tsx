import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'

// Types
interface Waypoint {
  latitude: number
  longitude: number
  waypoint_type?: string
  type?: string
  name?: string
  description?: string
  order_index?: number
}

interface RouteMapProps {
  waypoints?: Waypoint[]
  onMapClick?: (coords: { lat: number; lng: number }) => void
  selectedIndex?: number | null
}

interface MapControllerProps {
  waypoints: Waypoint[]
  selectedIndex: number | null
}

interface MapClickHandlerProps {
  onMapClick?: (coords: { lat: number; lng: number }) => void
}

// Create colored circle markers for different waypoint types
const createMarkerIcon = (color: string): L.DivIcon => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: ${color};
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

// Icon mapping for waypoint types
const getMarkerColor = (type?: string): string => {
  const colorMap = {
    start: '#22c55e',   // green
    end: '#ef4444',     // red
    fuel: '#f97316',    // orange
    rest: '#3b82f6',    // blue (for food/stop)
    photo: '#a855f7',   // purple (for scenic)
    camping: '#eab308', // yellow (for hotel)
    waypoint: '#6b7280', // gray (default)
  }

  // Map backend types to our display types
  const typeMap: Record<string, string> = {
    start: 'start',
    end: 'end',
    fuel: 'fuel',
    food: 'rest',
    stop: 'rest',
    scenic: 'photo',
    hotel: 'camping',
  }

  const displayType = (type && typeMap[type]) || 'waypoint'
  return colorMap[displayType as keyof typeof colorMap]
}

// Component to handle map centering when selectedIndex changes
function MapController({ waypoints, selectedIndex }: MapControllerProps) {
  const map = useMap()

  useEffect(() => {
    if (selectedIndex !== null && waypoints[selectedIndex]) {
      const waypoint = waypoints[selectedIndex]
      map.setView([waypoint.latitude, waypoint.longitude], map.getZoom())
    }
  }, [map, waypoints, selectedIndex])

  return null
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  const map = useMap()

  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
      }
    }

    map.on('click', handleClick)

    return () => {
      map.off('click', handleClick)
    }
  }, [map, onMapClick])

  return null
}

export function RouteMap({ waypoints = [], onMapClick, selectedIndex = null }: RouteMapProps) {
  // Default center on Europe or first waypoint
  const getMapCenter = (): [number, number] => {
    if (waypoints.length > 0) {
      return [waypoints[0].latitude, waypoints[0].longitude]
    }
    return [46.8, 8.2] // Europe center
  }

  const getMapZoom = (): number => {
    return waypoints.length > 0 ? 10 : 7
  }

  // Create polyline points from waypoints
  const polylinePoints: [number, number][] = waypoints.map(wp => [wp.latitude, wp.longitude])

  return (
    <div className="h-96 md:h-[400px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={getMapCenter()}
        zoom={getMapZoom()}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapController waypoints={waypoints} selectedIndex={selectedIndex} />
        <MapClickHandler onMapClick={onMapClick} />

        {/* Render waypoint markers */}
        {waypoints.map((waypoint, index) => (
          <Marker
            key={index}
            position={[waypoint.latitude, waypoint.longitude]}
            icon={createMarkerIcon(getMarkerColor(waypoint.waypoint_type || waypoint.type))}
          />
        ))}

        {/* Render polyline connecting waypoints */}
        {polylinePoints.length > 1 && (
          <Polyline
            positions={polylinePoints}
            pathOptions={{
              color: '#3b82f6',
              weight: 3,
              opacity: 0.7,
              dashArray: '10, 10'
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}