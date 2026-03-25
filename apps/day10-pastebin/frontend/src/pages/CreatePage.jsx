import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CodeEditor } from '../components/CodeEditor'

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

const EXPIRATIONS = [
  { value: null, label: 'Never' },
  { value: 10, label: '10 minutes' },
  { value: 60, label: '1 hour' },
  { value: 1440, label: '24 hours' },
  { value: 10080, label: '7 days' }
]

export function CreatePage() {
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('plaintext')
  const [expiration, setExpiration] = useState(null)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('Content is required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const pasteData = {
        content: content.trim(),
        ...(title.trim() && { title: title.trim() }),
        ...(language !== 'plaintext' && { language }),
        ...(expiration && { expires_in_minutes: expiration })
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pasteData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to create paste')
      }

      const result = await response.json()
      navigate(`/${result.short_id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Create New Paste</h1>
          <p className="text-gray-400 text-center">Share your code with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Language Dropdown */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-200 mb-2">
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Expiration Dropdown */}
            <div>
              <label htmlFor="expiration" className="block text-sm font-medium text-gray-200 mb-2">
                Expiration
              </label>
              <select
                id="expiration"
                value={expiration || ''}
                onChange={(e) => setExpiration(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {EXPIRATIONS.map((exp) => (
                  <option key={exp.value || 'never'} value={exp.value || ''}>
                    {exp.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Code Editor */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-2">
              Content
            </label>
            <CodeEditor
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Enter your ${language !== 'plaintext' ? language : 'code'} here...`}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Create Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-950"
            >
              {isLoading ? 'Creating...' : 'Create Paste'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}