import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RideCard } from '../components/RideCard'

// Mock ride data matching RideListItem interface
const mockRide = {
  id: 123,
  name: 'Mountain Trail Adventure',
  description: 'A scenic ride through mountain trails',
  start_latitude: 45.5017,
  start_longitude: -73.5673,
  total_distance_km: 150.5,
  is_public: true,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  waypoint_count: 12
}

const renderRideCard = (ride = mockRide) => {
  return render(
    <MemoryRouter>
      <RideCard ride={ride} />
    </MemoryRouter>
  )
}

describe('RideCard', () => {
  it('renders ride name', () => {
    renderRideCard()
    expect(screen.getByText('Mountain Trail Adventure')).toBeInTheDocument()
  })

  it('renders terrain badge', () => {
    renderRideCard()
    // Based on waypoint_count of 12, should be 'Mountain' terrain
    expect(screen.getByText('Mountain')).toBeInTheDocument()
  })

  it('links to correct ride URL', () => {
    renderRideCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/ride/123')
  })

  it('renders terrain badge with different waypoint counts', () => {
    // Test Mixed terrain (waypoint_count > 5 but <= 10)
    const mixedRide = { ...mockRide, waypoint_count: 8 }
    const { unmount } = renderRideCard(mixedRide)
    expect(screen.getByText('Mixed')).toBeInTheDocument()
    unmount()

    // Test Road terrain (waypoint_count <= 5)
    const roadRide = { ...mockRide, waypoint_count: 3 }
    renderRideCard(roadRide)
    expect(screen.getByText('Road')).toBeInTheDocument()
  })
})