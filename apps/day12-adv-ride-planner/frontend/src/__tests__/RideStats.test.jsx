import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RideStats } from '../components/RideStats'

// Mock ride data matching RideOut interface
const mockRide = {
  id: 1,
  name: 'Test Ride',
  description: 'Test description',
  start_latitude: 45.5017,
  start_longitude: -73.5673,
  total_distance_km: 125.8,
  is_public: true,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  terrain: 'gravel',
  difficulty: 'moderate',
  estimated_hours: 2.5,
  waypoints: [
    {
      id: 1,
      name: 'Start Point',
      description: 'Starting location',
      latitude: 45.5017,
      longitude: -73.5673,
      waypoint_type: 'start',
      order_index: 0,
      ride_id: 1,
      created_at: '2023-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'End Point',
      description: 'Ending location',
      latitude: 45.5120,
      longitude: -73.5800,
      waypoint_type: 'end',
      order_index: 1,
      ride_id: 1,
      created_at: '2023-01-01T00:00:00Z'
    }
  ]
}

const renderRideStats = (ride = mockRide) => {
  return render(<RideStats ride={ride} />)
}

describe('RideStats', () => {
  it('renders distance', () => {
    renderRideStats()
    expect(screen.getByText('125.8 km')).toBeInTheDocument()
  })

  it('renders estimated time', () => {
    renderRideStats()
    expect(screen.getByText('2.5 hrs')).toBeInTheDocument()
  })

  it('shows correct badge colors for terrain', () => {
    renderRideStats()
    const terrainBadge = screen.getByText('Gravel')
    expect(terrainBadge).toHaveClass('text-amber-400')
    expect(terrainBadge).toHaveClass('border-amber-500/50')
  })

  it('shows correct badge colors for difficulty', () => {
    renderRideStats()
    const difficultyBadge = screen.getByText('Moderate')
    expect(difficultyBadge).toHaveClass('text-yellow-400')
    expect(difficultyBadge).toHaveClass('border-yellow-500/50')
  })

  it('renders waypoint count', () => {
    renderRideStats()
    expect(screen.getByText('2 points')).toBeInTheDocument()
  })

  it('handles missing terrain and difficulty gracefully', () => {
    const rideWithoutBadges = {
      ...mockRide,
      terrain: undefined,
      difficulty: undefined
    }
    renderRideStats(rideWithoutBadges)
    expect(screen.getAllByText('Not set')).toHaveLength(2)
  })

  it('handles time formatting for short durations', () => {
    const shortRide = {
      ...mockRide,
      estimated_hours: 0.75 // 45 minutes
    }
    renderRideStats(shortRide)
    expect(screen.getByText('45 min')).toBeInTheDocument()
  })

  it('handles different terrain colors', () => {
    // Test road terrain
    const roadRide = { ...mockRide, terrain: 'road' }
    const { unmount } = renderRideStats(roadRide)
    let terrainBadge = screen.getByText('Road')
    expect(terrainBadge).toHaveClass('text-blue-400')
    unmount()

    // Test offroad terrain
    const offroadRide = { ...mockRide, terrain: 'offroad' }
    renderRideStats(offroadRide)
    terrainBadge = screen.getByText('Offroad')
    expect(terrainBadge).toHaveClass('text-red-400')
  })

  it('handles different difficulty colors', () => {
    // Test easy difficulty
    const easyRide = { ...mockRide, difficulty: 'easy' }
    const { unmount } = renderRideStats(easyRide)
    let difficultyBadge = screen.getByText('Easy')
    expect(difficultyBadge).toHaveClass('text-green-400')
    unmount()

    // Test hard difficulty
    const hardRide = { ...mockRide, difficulty: 'hard' }
    renderRideStats(hardRide)
    difficultyBadge = screen.getByText('Hard')
    expect(difficultyBadge).toHaveClass('text-orange-400')
  })
})