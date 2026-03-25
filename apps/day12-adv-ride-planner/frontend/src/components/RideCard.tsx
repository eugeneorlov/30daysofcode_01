import { Link } from 'react-router-dom'

interface RideListItem {
  id: number
  name: string
  description?: string
  start_latitude?: number
  start_longitude?: number
  total_distance_km?: number
  is_public: boolean
  created_at: string
  updated_at: string
  waypoint_count: number
}

interface RideCardProps {
  ride: RideListItem
}

// Helper function to determine terrain badge based on available data
const getTerrainBadge = (ride: RideListItem) => {
  // Placeholder logic - could be enhanced with actual terrain data
  if (ride.waypoint_count > 10) return 'Mountain'
  if (ride.waypoint_count > 5) return 'Mixed'
  return 'Road'
}

// Helper function to determine difficulty based on distance and waypoint count
const getDifficultyBadge = (ride: RideListItem) => {
  const distance = ride.total_distance_km || 0
  const waypoints = ride.waypoint_count

  if (distance > 300 || waypoints > 15) return 'Hard'
  if (distance > 100 || waypoints > 8) return 'Medium'
  return 'Easy'
}

// Helper function to get badge colors
const getBadgeColor = (type: string, value: string) => {
  if (type === 'terrain') {
    switch (value) {
      case 'Mountain': return 'bg-amber-600 text-amber-100'
      case 'Mixed': return 'bg-orange-600 text-orange-100'
      default: return 'bg-gray-600 text-gray-100'
    }
  }

  if (type === 'difficulty') {
    switch (value) {
      case 'Hard': return 'bg-red-600 text-red-100'
      case 'Medium': return 'bg-amber-600 text-amber-100'
      default: return 'bg-green-600 text-green-100'
    }
  }

  return 'bg-gray-600 text-gray-100'
}

// Helper function to format distance
const formatDistance = (distance?: number) => {
  if (!distance) return 'Unknown distance'
  return `${distance.toFixed(1)} km`
}

// Helper function to estimate ride time (rough estimate: 50 km/h average)
const estimateTime = (distance?: number) => {
  if (!distance) return 'Unknown time'
  const hours = distance / 50
  if (hours < 1) return `${Math.round(hours * 60)} min`
  if (hours < 24) return `${hours.toFixed(1)} hrs`
  const days = Math.ceil(hours / 8) // 8 hours riding per day
  return `${days} day${days > 1 ? 's' : ''}`
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function RideCard({ ride }: RideCardProps) {
  const terrain = getTerrainBadge(ride)
  const difficulty = getDifficultyBadge(ride)

  return (
    <Link
      to={`/ride/${ride.id}`}
      className="block bg-gray-800 rounded-lg p-6 border border-gray-700 hover:ring-1 hover:ring-amber-500/50 transition-all duration-200 hover:border-amber-500/50"
    >
      <div className="space-y-4">
        {/* Header with name and badges */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-white truncate" title={ride.name}>
            {ride.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor('terrain', terrain)}`}>
              {terrain}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor('difficulty', difficulty)}`}>
              {difficulty}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-gray-300">
            <div className="text-gray-400">Distance</div>
            <div className="font-medium text-amber-400">
              {formatDistance(ride.total_distance_km)}
            </div>
          </div>
          <div className="text-gray-300">
            <div className="text-gray-400">Est. Time</div>
            <div className="font-medium text-amber-400">
              {estimateTime(ride.total_distance_km)}
            </div>
          </div>
          <div className="text-gray-300">
            <div className="text-gray-400">Waypoints</div>
            <div className="font-medium text-amber-400">
              {ride.waypoint_count}
            </div>
          </div>
          <div className="text-gray-300">
            <div className="text-gray-400">Created</div>
            <div className="font-medium text-amber-400">
              {formatDate(ride.created_at)}
            </div>
          </div>
        </div>

        {/* Description */}
        {ride.description && (
          <p className="text-gray-400 text-sm line-clamp-2" title={ride.description}>
            {ride.description}
          </p>
        )}
      </div>
    </Link>
  )
}