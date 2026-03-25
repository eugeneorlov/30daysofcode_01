import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CodeBlock } from '../components/CodeBlock'

const LANGUAGES = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' }
]

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getLanguageLabel(value) {
  const lang = LANGUAGES.find(l => l.value === value)
  return lang ? lang.label : value
}

export function ViewPage() {
  const { shortId } = useParams()
  const [paste, setPaste] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`/api/pastes/${shortId}`)

        if (response.status === 404) {
          setError('Paste not found')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch paste')
        }

        const data = await response.json()
        setPaste(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (shortId) {
      fetchPaste()
    }
  }, [shortId])

  const handleRawView = () => {
    if (paste) {
      const blob = new Blob([paste.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      // Clean up the URL object after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 100)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-400">Loading paste...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold text-gray-200 mb-4">
              {error === 'Paste not found' ? '404 - Paste Not Found' : 'Error'}
            </h1>
            <p className="text-gray-400 mb-8">
              {error === 'Paste not found'
                ? "The paste you're looking for doesn't exist or has been deleted."
                : error
              }
            </p>
            <Link
              to="/new"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Create New Paste
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!paste) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-100">
              {paste.title || 'Untitled'}
            </h1>
            <div className="flex gap-3">
              <button
                onClick={handleRawView}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Raw
              </button>
              <Link
                to="/new"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                New Paste
              </Link>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-gray-800 rounded text-purple-300 font-medium">
                {getLanguageLabel(paste.language)}
              </span>
            </div>
            <div>
              Created: {formatDate(paste.created_at)}
            </div>
            <div>
              Views: {paste.view_count}
            </div>
            {paste.expires_at && (
              <div>
                Expires: {formatDate(paste.expires_at)}
              </div>
            )}
          </div>
        </div>

        {/* Code Block */}
        <div className="mb-8">
          <CodeBlock code={paste.content} language={paste.language} />
        </div>
      </div>
    </div>
  )
}