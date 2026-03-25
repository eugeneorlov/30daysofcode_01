import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CodeBlock } from '../components/CodeBlock'

// Mock highlight.js
vi.mock('highlight.js/lib/core', () => ({
  default: {
    highlightElement: vi.fn(),
    registerLanguage: vi.fn()
  }
}))

// Mock all the highlight.js language imports
vi.mock('highlight.js/lib/languages/javascript', () => ({ default: {} }))
vi.mock('highlight.js/lib/languages/python', () => ({ default: {} }))
vi.mock('highlight.js/lib/languages/sql', () => ({ default: {} }))
vi.mock('highlight.js/lib/languages/bash', () => ({ default: {} }))
vi.mock('highlight.js/lib/languages/typescript', () => ({ default: {} }))
vi.mock('highlight.js/lib/languages/xml', () => ({ default: {} }))
vi.mock('highlight.js/lib/languages/css', () => ({ default: {} }))
vi.mock('highlight.js/lib/languages/json', () => ({ default: {} }))
vi.mock('highlight.js/lib/languages/markdown', () => ({ default: {} }))

// Mock the CSS import
vi.mock('highlight.js/styles/github-dark.css', () => ({}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve())
  }
})

describe('CodeBlock', () => {
  const testCode = 'console.log("Hello, World!");'

  it('renders code content in a pre/code block', () => {
    render(<CodeBlock code={testCode} language="javascript" />)

    const codeElement = screen.getByText(testCode)
    expect(codeElement).toBeInTheDocument()
    expect(codeElement.tagName).toBe('CODE')
    expect(codeElement.closest('pre')).toBeInTheDocument()
  })

  it('displays line numbers', () => {
    const multiLineCode = 'line 1\nline 2\nline 3'
    render(<CodeBlock code={multiLineCode} language="plaintext" />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders copy button', () => {
    render(<CodeBlock code={testCode} language="javascript" />)

    const copyButton = screen.getByText('Copy')
    expect(copyButton).toBeInTheDocument()
    expect(copyButton.tagName).toBe('BUTTON')
  })

  it('shows "Copied!" message when copy button is clicked', async () => {
    render(<CodeBlock code={testCode} language="javascript" />)

    const copyButton = screen.getByText('Copy')
    fireEvent.click(copyButton)

    // Wait for the async state update
    expect(await screen.findByText('Copied!')).toBeInTheDocument()
  })

  it('applies language class when language is not plaintext', () => {
    render(<CodeBlock code={testCode} language="javascript" />)

    const codeElement = screen.getByText(testCode)
    expect(codeElement).toHaveClass('language-javascript')
  })

  it('does not apply language class for plaintext', () => {
    render(<CodeBlock code={testCode} language="plaintext" />)

    const codeElement = screen.getByText(testCode)
    expect(codeElement).not.toHaveClass('language-plaintext')
    expect(codeElement).toHaveClass('text-gray-200')
  })
})