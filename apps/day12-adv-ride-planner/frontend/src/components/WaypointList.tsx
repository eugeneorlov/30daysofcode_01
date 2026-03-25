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

interface WaypointListProps {
  waypoints?: Waypoint[]
  onUpdate?: (waypoints: Waypoint[]) => void
  onDelete?: (index: number) => void
  onReorder?: (waypoints: Waypoint[]) => void
}

export function WaypointList({ waypoints = [], onUpdate, onDelete, onReorder }: WaypointListProps) {
  const waypointTypes = [
    { value: 'start', label: 'Start' },
    { value: 'end', label: 'End' },
    { value: 'fuel', label: 'Fuel Stop' },
    { value: 'food', label: 'Food/Rest' },
    { value: 'stop', label: 'Rest Stop' },
    { value: 'scenic', label: 'Photo/Scenic' },
    { value: 'hotel', label: 'Hotel/Camping' },
  ]

  const handleWaypointChange = (index: number, field: string, value: string) => {
    const updatedWaypoints = waypoints.map((wp, i) =>
      i === index ? { ...wp, [field]: value } : wp
    )
    if (onUpdate) {
      onUpdate(updatedWaypoints)
    }
  }

  const handleMoveUp = (index: number) => {
    if (index > 0 && onReorder) {
      const newWaypoints = [...waypoints]
      const temp = newWaypoints[index]
      newWaypoints[index] = newWaypoints[index - 1]
      newWaypoints[index - 1] = temp
      onReorder(newWaypoints)
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < waypoints.length - 1 && onReorder) {
      const newWaypoints = [...waypoints]
      const temp = newWaypoints[index]
      newWaypoints[index] = newWaypoints[index + 1]
      newWaypoints[index + 1] = temp
      onReorder(newWaypoints)
    }
  }

  const handleDelete = (index: number) => {
    if (onDelete) {
      onDelete(index)
    }
  }

  if (waypoints.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Waypoints</h3>
        <p className="text-gray-400">Click on the map to add waypoints</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        Waypoints ({waypoints.length})
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {waypoints.map((waypoint, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-start gap-2 mb-3">
              {/* Drag handle and reorder buttons */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  ▲
                </button>
                <span className="text-xs text-gray-500 text-center w-6">
                  {index + 1}
                </span>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === waypoints.length - 1}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  ▼
                </button>
              </div>

              <div className="flex-1 space-y-2">
                {/* Name input */}
                <div>
                  <input
                    type="text"
                    value={waypoint.name || ''}
                    onChange={(e) => handleWaypointChange(index, 'name', e.target.value)}
                    placeholder="Waypoint name"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Type dropdown */}
                <div>
                  <select
                    value={waypoint.waypoint_type || waypoint.type || 'stop'}
                    onChange={(e) => handleWaypointChange(index, 'waypoint_type', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                  >
                    {waypointTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes input */}
                <div>
                  <textarea
                    value={waypoint.description || waypoint.notes || ''}
                    onChange={(e) => handleWaypointChange(index, 'description', e.target.value)}
                    placeholder="Notes (optional)"
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Coordinates display */}
                <div className="flex gap-2 text-sm">
                  <span className="text-gray-400">Lat:</span>
                  <span className="text-gray-300 font-mono">
                    {(waypoint.latitude || 0).toFixed(4)}
                  </span>
                  <span className="text-gray-400">Lng:</span>
                  <span className="text-gray-300 font-mono">
                    {(waypoint.longitude || 0).toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(index)}
                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded"
                title="Delete waypoint"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}