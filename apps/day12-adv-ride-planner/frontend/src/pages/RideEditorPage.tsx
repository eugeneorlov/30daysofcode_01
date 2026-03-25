import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { RouteMap } from '../components/RouteMap'
import { WaypointList } from '../components/WaypointList'

const API_BASE = 'http://localhost:8000/api/rides'

// Types
interface Waypoint {
  latitude: number
  longitude: number
  waypoint_type?: string
  type?: string
  name?: string
  description?: string
  notes?: string
  order_index?: number
}

interface FormData {
  name: string
  description: string
  terrain: string
  difficulty: string
  estimated_hours: string
  total_distance_km: string
}

export function RideEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id && id !== 'new')

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    terrain: '',
    difficulty: '',
    estimated_hours: '',
    total_distance_km: '',
  })

  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [selectedWaypointIndex, setSelectedWaypointIndex] = useState<number | null>(null)

  // Terrain and difficulty options
  const terrainOptions = [
    { value: '', label: 'Select terrain...' },
    { value: 'road', label: 'Road' },
    { value: 'gravel', label: 'Gravel' },
    { value: 'offroad', label: 'Off-road' },
    { value: 'mixed', label: 'Mixed' },
  ]

  const difficultyOptions = [
    { value: '', label: 'Select difficulty...' },
    { value: 'easy', label: 'Easy' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'hard', label: 'Hard' },
    { value: 'expert', label: 'Expert' },
  ]

  // Load existing ride data in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadRideData()
    }
  }, [id, isEditMode])

  const loadRideData = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/${id}`)

      if (!response.ok) {
        throw new Error('Failed to load ride data')
      }

      const ride = await response.json()

      setFormData({
        name: ride.name || '',
        description: ride.description || '',
        terrain: ride.terrain || '',
        difficulty: ride.difficulty || '',
        estimated_hours: ride.estimated_hours || '',
        total_distance_km: ride.total_distance_km || '',
      })

      setWaypoints(ride.waypoints || [])
    } catch (err) {
      setError(`Failed to load ride: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleMapClick = ({ lat, lng }: { lat: number; lng: number }) => {
    const waypointCount = waypoints.length
    const newWaypoint = {
      name: `Waypoint ${waypointCount + 1}`,
      description: '',
      latitude: lat,
      longitude: lng,
      waypoint_type: 'stop',
      order_index: waypointCount,
    }
    setWaypoints(prev => [...prev, newWaypoint])
  }

  const handleWaypointsUpdate = (updatedWaypoints: Waypoint[]) => {
    setWaypoints(updatedWaypoints)
  }

  const handleWaypointDelete = (index: number) => {
    const updatedWaypoints = waypoints.filter((_, i) => i !== index)
    // Update order indices
    const reindexedWaypoints = updatedWaypoints.map((wp, i) => ({
      ...wp,
      order_index: i,
    }))
    setWaypoints(reindexedWaypoints)
    setSelectedWaypointIndex(null)
  }

  const handleWaypointsReorder = (reorderedWaypoints: Waypoint[]) => {
    // Update order indices
    const reindexedWaypoints = reorderedWaypoints.map((wp, i) => ({
      ...wp,
      order_index: i,
    }))
    setWaypoints(reindexedWaypoints)
    setSelectedWaypointIndex(null)
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Ride name is required')
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    setError('')

    try {
      const rideData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        start_latitude: waypoints.length > 0 ? waypoints[0].latitude : null,
        start_longitude: waypoints.length > 0 ? waypoints[0].longitude : null,
        total_distance_km: formData.total_distance_km ? parseFloat(formData.total_distance_km) : null,
        is_public: true,
        waypoints: waypoints.map((wp, index) => ({
          name: wp.name || `Waypoint ${index + 1}`,
          description: wp.description || '',
          latitude: wp.latitude,
          longitude: wp.longitude,
          waypoint_type: wp.waypoint_type || 'stop',
          order_index: index,
        }))
      }

      const url = isEditMode ? `${API_BASE}/${id}` : API_BASE
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rideData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} ride`)
      }

      const savedRide = await response.json()
      navigate(`/ride/${savedRide.id}`)
    } catch (err) {
      setError(`Failed to save ride: ${(err as Error).message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-4 flex items-center justify-center">
        <div className="text-white">Loading ride data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Rides
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white">
            {isEditMode ? 'Edit Ride' : 'Plan New Ride'}
          </h1>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Main form */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Ride Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Enter ride name"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Total Distance */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Total Distance (km)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.total_distance_km}
                onChange={(e) => handleFormChange('total_distance_km', e.target.value)}
                placeholder="0.0"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Terrain */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Terrain
              </label>
              <select
                value={formData.terrain}
                onChange={(e) => handleFormChange('terrain', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              >
                {terrainOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleFormChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
              >
                {difficultyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.estimated_hours}
                onChange={(e) => handleFormChange('estimated_hours', e.target.value)}
                placeholder="0.0"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Describe your ride..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Map and Waypoints */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Map */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Route Map</h3>
            <RouteMap
              waypoints={waypoints}
              onMapClick={handleMapClick}
              selectedIndex={selectedWaypointIndex}
            />
            <p className="text-gray-400 text-sm mt-2">
              Click on the map to add waypoints
            </p>
          </div>

          {/* Waypoints List */}
          <WaypointList
            waypoints={waypoints}
            onUpdate={handleWaypointsUpdate}
            onDelete={handleWaypointDelete}
            onReorder={handleWaypointsReorder}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : isEditMode ? 'Update Ride' : 'Save Ride'}
          </button>

          <button
            onClick={handleCancel}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}