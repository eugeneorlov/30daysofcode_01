import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RideCard } from '../components/RideCard'

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

export function RideListPage() {
  const [rides, setRides] = useState<RideListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('http://localhost:8000/api/rides')

        if (!response.ok) {
          throw new Error(`Failed to fetch rides: ${response.status}`)
        }

        const ridesData = await response.json()
        setRides(ridesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching rides:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRides()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your rides...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-4">⚠️ Error loading rides</div>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">

        {/* Content */}
        {rides.length === 0 ? (
          // Empty state
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-6">🏍️</div>
              <h2 className="text-xl font-semibold text-white mb-4">
                No rides planned yet
              </h2>
              <p className="text-gray-400 mb-8">
                Start your first adventure! Plan a ride to explore amazing routes and discover new places.
              </p>
              <Link
                to="/ride/new"
                className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-md font-medium transition-colors inline-flex items-center space-x-2"
              >
                <span>🗺️</span>
                <span>Plan Your First Ride</span>
              </Link>
            </div>
          </div>
        ) : (
          // Ride grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}