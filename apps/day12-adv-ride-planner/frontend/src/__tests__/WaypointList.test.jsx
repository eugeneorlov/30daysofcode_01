import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WaypointList } from '../components/WaypointList'

// Mock waypoint data
const mockWaypoints = [
  {
    latitude: 45.5017,
    longitude: -73.5673,
    name: 'Start Point',
    description: 'Beginning of the ride',
    waypoint_type: 'start',
    order_index: 0
  },
  {
    latitude: 45.5120,
    longitude: -73.5800,
    name: 'Rest Stop',
    description: 'Quick break location',
    waypoint_type: 'food',
    order_index: 1
  },
  {
    latitude: 45.5200,
    longitude: -73.5900,
    name: 'End Point',
    description: 'Final destination',
    waypoint_type: 'end',
    order_index: 2
  }
]

const renderWaypointList = (props = {}) => {
  const defaultProps = {
    waypoints: mockWaypoints,
    onUpdate: vi.fn(),
    onDelete: vi.fn(),
    onReorder: vi.fn(),
    ...props
  }
  return render(<WaypointList {...defaultProps} />)
}

describe('WaypointList', () => {
  it('renders waypoint names', () => {
    renderWaypointList()

    expect(screen.getByDisplayValue('Start Point')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Rest Stop')).toBeInTheDocument()
    expect(screen.getByDisplayValue('End Point')).toBeInTheDocument()
  })

  it('calls onDelete when delete button clicked', () => {
    const mockOnDelete = vi.fn()
    renderWaypointList({ onDelete: mockOnDelete })

    const deleteButtons = screen.getAllByTitle('Delete waypoint')
    expect(deleteButtons).toHaveLength(3)

    // Click the first delete button
    fireEvent.click(deleteButtons[0])
    expect(mockOnDelete).toHaveBeenCalledWith(0)

    // Click the second delete button
    fireEvent.click(deleteButtons[1])
    expect(mockOnDelete).toHaveBeenCalledWith(1)
  })

  it('displays waypoint count in header', () => {
    renderWaypointList()
    expect(screen.getByText('Waypoints (3)')).toBeInTheDocument()
  })

  it('renders waypoint coordinates', () => {
    renderWaypointList()
    expect(screen.getByText('45.5017')).toBeInTheDocument()
    expect(screen.getByText('-73.5673')).toBeInTheDocument()
    expect(screen.getByText('45.5120')).toBeInTheDocument()
    expect(screen.getByText('-73.5800')).toBeInTheDocument()
  })

  it('shows empty state when no waypoints', () => {
    renderWaypointList({ waypoints: [] })
    expect(screen.getByText('Click on the map to add waypoints')).toBeInTheDocument()
  })

  it('renders waypoint type dropdowns', () => {
    renderWaypointList()
    const typeDropdowns = screen.getAllByDisplayValue('Start')
    expect(typeDropdowns).toHaveLength(1)

    const foodDropdowns = screen.getAllByDisplayValue('Food/Rest')
    expect(foodDropdowns).toHaveLength(1)

    const endDropdowns = screen.getAllByDisplayValue('End')
    expect(endDropdowns).toHaveLength(1)
  })

  it('renders waypoint descriptions', () => {
    renderWaypointList()
    expect(screen.getByDisplayValue('Beginning of the ride')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Quick break location')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Final destination')).toBeInTheDocument()
  })

  it('renders move up/down buttons', () => {
    renderWaypointList()
    const moveUpButtons = screen.getAllByTitle('Move up')
    const moveDownButtons = screen.getAllByTitle('Move down')

    expect(moveUpButtons).toHaveLength(3)
    expect(moveDownButtons).toHaveLength(3)

    // First waypoint's move up button should be disabled
    expect(moveUpButtons[0]).toBeDisabled()

    // Last waypoint's move down button should be disabled
    expect(moveDownButtons[2]).toBeDisabled()
  })
})