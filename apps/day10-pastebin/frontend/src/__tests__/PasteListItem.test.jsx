import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { PasteListItem } from '../components/PasteListItem'

// Mock the time utility since we don't want to test date formatting here
vi.mock('../utils/time', () => ({
  formatRelativeTime: vi.fn(() => '2 minutes ago')
}))

describe('PasteListItem', () => {
  const mockPaste = {
    short_id: 'abc123',
    title: 'Test Paste',
    language: 'javascript',
    created_at: '2024-03-25T10:00:00Z',
    view_count: 5
  }

  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    )
  }

  it('renders title and language', () => {
    renderWithRouter(<PasteListItem paste={mockPaste} />)

    expect(screen.getByText('Test Paste')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
  })

  it('links to correct shortId URL', () => {
    renderWithRouter(<PasteListItem paste={mockPaste} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/abc123')
  })

  it('displays view count correctly', () => {
    renderWithRouter(<PasteListItem paste={mockPaste} />)

    expect(screen.getByText('5 views')).toBeInTheDocument()
  })

  it('displays singular view count', () => {
    const pasteWithOneView = { ...mockPaste, view_count: 1 }
    renderWithRouter(<PasteListItem paste={pasteWithOneView} />)

    expect(screen.getByText('1 view')).toBeInTheDocument()
  })

  it('renders untitled for paste without title', () => {
    const pasteWithoutTitle = { ...mockPaste, title: null }
    renderWithRouter(<PasteListItem paste={pasteWithoutTitle} />)

    expect(screen.getByText('Untitled')).toBeInTheDocument()
  })

  it('displays formatted language name', () => {
    const pythonPaste = { ...mockPaste, language: 'python' }
    renderWithRouter(<PasteListItem paste={pythonPaste} />)

    expect(screen.getByText('Python')).toBeInTheDocument()
  })
})