import { Link } from 'react-router-dom'
import { formatRelativeTime } from '../utils/time'

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

function getLanguageLabel(value) {
  const lang = LANGUAGES.find(l => l.value === value)
  return lang ? lang.label : value
}

export function PasteListItem({ paste }) {
  return (
    <Link
      to={`/${paste.short_id}`}
      className="block p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-100 truncate mb-2">
            {paste.title || 'Untitled'}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="px-2 py-1 bg-gray-700 rounded text-purple-300 font-medium">
              {getLanguageLabel(paste.language)}
            </span>
            <span>{formatRelativeTime(paste.created_at)}</span>
            <span>{paste.view_count} view{paste.view_count === 1 ? '' : 's'}</span>
          </div>
        </div>
        <div className="ml-4">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}