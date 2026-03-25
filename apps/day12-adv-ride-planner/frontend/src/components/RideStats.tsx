import React from 'react'

// Types for the ride stats component
interface Waypoint {
  id: number
  name: string
  description?: string
  latitude: number
  longitude: number
  waypoint_type: string
  order_index: number
  ride_id: number
  created_at: string
}

interface RideOut {
  id: number
  name: string
  description?: string
  start_latitude?: number
  start_longitude?: number
  total_distance_km?: number
  is_public: boolean
  created_at: string
  updated_at: string
  waypoints: Waypoint[]
  terrain?: string
  difficulty?: string
  estimated_hours?: number
}

interface RideStatsProps {
  ride: RideOut
}

// Badge component for terrain and difficulty
function Badge({ type, value }: { type: 'terrain' | 'difficulty', value: string }) {
  const getTerrainColors = (terrain: string): string => {
    const colorMap: Record<string, string> = {
      road: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      gravel: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
      offroad: 'bg-red-500/20 text-red-400 border-red-500/50',
      mixed: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    }
    return colorMap[terrain] || 'bg-gray-500/20 text-gray-400 border-gray-500/50'
  }

  const getDifficultyColors = (difficulty: string): string => {
    const colorMap: Record<string, string> = {
      easy: 'bg-green-500/20 text-green-400 border-green-500/50',
      moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      hard: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      expert: 'bg-red-500/20 text-red-400 border-red-500/50',
    }
    return colorMap[difficulty] || 'bg-gray-500/20 text-gray-400 border-gray-500/50'
  }

  const colors = type === 'terrain' ? getTerrainColors(value) : getDifficultyColors(value)
  const displayValue = value.charAt(0).toUpperCase() + value.slice(1)

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${colors}`}>
      {displayValue}
    </span>
  )
}

// Stat card component
function StatCard({ label, value, icon }: { label: string, value: string | number | React.ReactNode, icon?: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-gray-400 text-sm">{icon}</span>}
        <span className="text-gray-400 text-sm font-medium">{label}</span>
      </div>
      <div className="text-white font-semibold">
        {value}
      </div>
    </div>
  )
}

export function RideStats({ ride }: RideStatsProps) {
  // Format distance
  const formatDistance = (distance?: number): string => {
    if (!distance) return 'Not set'
    return `${distance.toFixed(1)} km`
  }

  // Format estimated time
  const formatEstimatedTime = (hours?: number): string => {
    if (!hours) return 'Not set'
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`
    }
    return `${hours.toFixed(1)} hr${hours !== 1 ? 's' : ''}`
  }

  // Get waypoint count
  const waypointCount = ride.waypoints?.length || 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* Terrain Badge */}
      <StatCard
        label="Terrain"
        value={ride.terrain ? <Badge type="terrain" value={ride.terrain} /> : <span className="text-gray-500">Not set</span>}
        icon="🏔️"
      />

      {/* Difficulty Badge */}
      <StatCard
        label="Difficulty"
        value={ride.difficulty ? <Badge type="difficulty" value={ride.difficulty} /> : <span className="text-gray-500">Not set</span>}
        icon="⚡"
      />

      {/* Distance */}
      <StatCard
        label="Distance"
        value={formatDistance(ride.total_distance_km)}
        icon="📏"
      />

      {/* Estimated Time */}
      <StatCard
        label="Estimated Time"
        value={formatEstimatedTime(ride.estimated_hours)}
        icon="⏱️"
      />

      {/* Waypoint Count */}
      <StatCard
        label="Waypoints"
        value={`${waypointCount} point${waypointCount !== 1 ? 's' : ''}`}
        icon="📍"
      />
    </div>
  )
}