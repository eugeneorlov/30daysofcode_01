import { useEffect, useRef, useState } from 'react'
import hljs from 'highlight.js/lib/core'

// Import common languages
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml' // for HTML
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'

// Import dark theme CSS
import 'highlight.js/styles/github-dark.css'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)

export function CodeBlock({ code, language = 'plaintext' }) {
  const codeRef = useRef(null)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    if (codeRef.current && language !== 'plaintext') {
      // Clear any existing highlighting
      codeRef.current.removeAttribute('data-highlighted')

      // Apply syntax highlighting
      hljs.highlightElement(codeRef.current)
    }
  }, [code, language])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Split code into lines for line numbers
  const lines = code.split('\n')

  return (
    <div className="relative bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      {/* Copy button */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleCopy}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {copySuccess ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="flex">
        {/* Line numbers */}
        <div className="select-none bg-gray-800 px-4 py-4 text-gray-400 text-sm font-mono border-r border-gray-700 min-w-[3rem]">
          {lines.map((_, index) => (
            <div key={index + 1} className="leading-6">
              {index + 1}
            </div>
          ))}
        </div>

        {/* Code content */}
        <div className="flex-1 overflow-x-auto">
          <pre className="p-4 text-sm leading-6">
            <code
              ref={codeRef}
              className={language !== 'plaintext' ? `language-${language}` : 'text-gray-200'}
            >
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}