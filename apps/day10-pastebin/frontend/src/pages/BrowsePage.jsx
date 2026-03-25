import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PasteListItem } from '../components/PasteListItem'

export function BrowsePage() {
  const [pastes, setPastes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecentPastes = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch('/api/pastes/recent')

        if (!response.ok) {
          throw new Error('Failed to fetch recent pastes')
        }

        const data = await response.json()
        setPastes(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentPastes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-400">Loading recent pastes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-100">Recent Pastes</h1>
            <Link
              to="/new"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              New Paste
            </Link>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 mb-8">
            {error}
          </div>
        )}

        {/* Content */}
        {!error && (
          <div>
            {pastes.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16">
                <div className="mb-6">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-300 mb-2">
                  No pastes yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Create one to get started!
                </p>
                <Link
                  to="/new"
                  className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Create New Paste
                </Link>
              </div>
            ) : (
              /* Paste List */
              <div className="space-y-4">
                {pastes.map((paste) => (
                  <PasteListItem key={paste.short_id} paste={paste} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}