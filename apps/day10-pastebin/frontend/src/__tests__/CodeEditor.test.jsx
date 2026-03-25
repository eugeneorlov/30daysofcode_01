import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { CodeEditor } from '../components/CodeEditor'

describe('CodeEditor', () => {
  it('renders textarea with placeholder', () => {
    render(<CodeEditor value="" onChange={vi.fn()} />)

    const textarea = screen.getByPlaceholderText('Enter your code here...')
    expect(textarea).toBeInTheDocument()
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('calls onChange when typed into', () => {
    const mockOnChange = vi.fn()
    render(<CodeEditor value="" onChange={mockOnChange} />)

    const textarea = screen.getByPlaceholderText('Enter your code here...')
    fireEvent.change(textarea, { target: { value: 'test code' } })

    expect(mockOnChange).toHaveBeenCalledOnce()
  })

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Custom placeholder text'
    render(<CodeEditor value="" onChange={vi.fn()} placeholder={customPlaceholder} />)

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument()
  })

  it('renders with provided value', () => {
    const testValue = 'console.log("hello world")'
    render(<CodeEditor value={testValue} onChange={vi.fn()} />)

    const textarea = screen.getByDisplayValue(testValue)
    expect(textarea).toBeInTheDocument()
  })
})