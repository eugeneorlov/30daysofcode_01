import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { RouteMap } from '../components/RouteMap'
import { RideStats } from '../components/RideStats'

const API_BASE = 'http://localhost:8000/api/rides'

// Types
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

// Waypoint type badge component
function WaypointTypeBadge({ type }: { type: string }) {
  const getTypeColors = (type: string): string => {
    const colorMap: Record<string, string> = {
      start: 'bg-green-500/20 text-green-400 border-green-500/50',
      end: 'bg-red-500/20 text-red-400 border-red-500/50',
      fuel: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      food: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      stop: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      scenic: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      hotel: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    }
    return colorMap[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/50'
  }

  const getTypeLabel = (type: string): string => {
    const labelMap: Record<string, string> = {
      start: 'Start',
      end: 'End',
      fuel: 'Fuel',
      food: 'Food/Rest',
      stop: 'Rest Stop',
      scenic: 'Photo/Scenic',
      hotel: 'Hotel/Camping',
    }
    return labelMap[type] || type.charAt(0).toUpperCase() + type.slice(1)
  }

  const colors = getTypeColors(type)
  const label = getTypeLabel(type)

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${colors}`}>
      {label}
    </span>
  )
}

export function RideDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [ride, setRide] = useState<RideOut | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Fetch ride data on mount
  useEffect(() => {
    if (id) {
      fetchRide()
    }
  }, [id])

  const fetchRide = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/${id}`)

      if (response.status === 404) {
        setError('Ride not found')
        setRide(null)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to load ride')
      }

      const rideData = await response.json()
      setRide(rideData)
    } catch (err) {
      setError(`Failed to load ride: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete ride')
      }

      navigate('/')
    } catch (err) {
      setError(`Failed to delete ride: ${(err as Error).message}`)
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-4 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-white">Loading ride...</span>
        </div>
      </div>
    )
  }

  // Error/404 state
  if (error || !ride) {
    return (
      <div className="min-h-screen bg-gray-950 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Rides
            </Link>
          </div>

          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">
              {error.includes('not found') ? 'Ride Not Found' : 'Error Loading Ride'}
            </h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Return to Rides
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/"
            className="text-blue-400 hover:text-blue-300 transition-colors mb-4 inline-block"
          >
            ← Back to Rides
          </Link>
          <h1 className="text-3xl font-bold text-white">{ride.name}</h1>
          {ride.description && (
            <p className="text-gray-300 mt-2">{ride.description}</p>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Ride Stats */}
        <div className="mb-6">
          <RideStats ride={ride} />
        </div>

        {/* Route Map */}
        <div className="mb-6">
          <div className="bg-gray-900 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-white mb-4">Route Map</h2>
            <div className="h-[500px] w-full rounded-lg overflow-hidden">
              <RouteMap
                waypoints={ride.waypoints}
                onMapClick={undefined} // Non-interactive
                selectedIndex={null}
              />
            </div>
          </div>
        </div>

        {/* Waypoint Table */}
        <div className="mb-6">
          <div className="bg-gray-900 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Waypoints ({ride.waypoints.length})
            </h2>

            {ride.waypoints.length === 0 ? (
              <p className="text-gray-400">No waypoints added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-300 font-medium py-3 px-4">#</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Name</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Type</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Coordinates</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ride.waypoints.map((waypoint, index) => (
                      <tr key={waypoint.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-3 px-4 text-gray-400 font-mono">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 text-white font-medium">
                          {waypoint.name}
                        </td>
                        <td className="py-3 px-4">
                          <WaypointTypeBadge type={waypoint.waypoint_type} />
                        </td>
                        <td className="py-3 px-4 text-gray-300 font-mono text-sm">
                          {waypoint.latitude.toFixed(4)}, {waypoint.longitude.toFixed(4)}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {waypoint.description || <span className="text-gray-500 italic">No notes</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Link
            to={`/ride/${ride.id}/edit`}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Edit Ride
          </Link>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Delete Ride
          </button>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Delete Ride
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{ride.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}