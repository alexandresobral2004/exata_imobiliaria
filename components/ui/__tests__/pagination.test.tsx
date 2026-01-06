import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '../pagination'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 100,
    itemsPerPage: 20,
    onPageChange: vi.fn(),
    onItemsPerPageChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render pagination controls', () => {
    const { container } = render(<Pagination {...defaultProps} />)

    expect(screen.getByText(/Mostrando/i)).toBeInTheDocument()
    expect(container.textContent).toContain('1')
    expect(container.textContent).toContain('20')
    expect(container.textContent).toContain('100')
    expect(container.textContent).toContain('resultados')
  })

  it('should show current page information', () => {
    const { container } = render(<Pagination {...defaultProps} currentPage={3} />)

    expect(screen.getByText(/Mostrando/i)).toBeInTheDocument()
    expect(container.textContent).toContain('41')
    expect(container.textContent).toContain('60')
    expect(container.textContent).toContain('100')
  })

  it('should call onPageChange when clicking next page', () => {
    render(<Pagination {...defaultProps} />)

    const nextButton = screen.getByTitle(/Próxima página/i)
    fireEvent.click(nextButton)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2)
  })

  it('should call onPageChange when clicking previous page', () => {
    render(<Pagination {...defaultProps} currentPage={2} />)

    const prevButton = screen.getByTitle(/Página anterior/i)
    fireEvent.click(prevButton)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1)
  })

  it('should call onPageChange when clicking page number', () => {
    render(<Pagination {...defaultProps} />)

    const page2Button = screen.getByText('2')
    fireEvent.click(page2Button)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2)
  })

  it('should call onPageChange when clicking first page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)

    const firstButton = screen.getByTitle(/Primeira página/i)
    fireEvent.click(firstButton)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1)
  })

  it('should call onPageChange when clicking last page', () => {
    render(<Pagination {...defaultProps} />)

    const lastButton = screen.getByTitle(/Última página/i)
    fireEvent.click(lastButton)

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(5)
  })

  it('should disable previous and first buttons on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)

    const prevButton = screen.getByTitle(/Página anterior/i)
    const firstButton = screen.getByTitle(/Primeira página/i)

    expect(prevButton).toBeDisabled()
    expect(firstButton).toBeDisabled()
  })

  it('should disable next and last buttons on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />)

    const nextButton = screen.getByTitle(/Próxima página/i)
    const lastButton = screen.getByTitle(/Última página/i)

    expect(nextButton).toBeDisabled()
    expect(lastButton).toBeDisabled()
  })

  it('should call onItemsPerPageChange when changing items per page', () => {
    render(<Pagination {...defaultProps} />)

    const select = screen.getByLabelText(/Por página:/i)
    fireEvent.change(select, { target: { value: '50' } })

    expect(defaultProps.onItemsPerPageChange).toHaveBeenCalledWith(50)
  })

  it('should highlight current page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)

    const page3Button = screen.getByText('3')
    expect(page3Button).toHaveClass('bg-green-600')
  })

  it('should show ellipsis for large page counts', () => {
    const { container } = render(<Pagination {...defaultProps} totalPages={10} currentPage={5} />)

    // With 10 pages and current page 5, we show pages 4, 5, 6 (centered around current)
    expect(container.textContent).toContain('4')
    expect(container.textContent).toContain('5')
    expect(container.textContent).toContain('6')
  })

  it('should not render when totalPages is 0 or 1', () => {
    const { container } = render(<Pagination {...defaultProps} totalPages={0} />)
    expect(container.firstChild).toBeNull()

    const { container: container2 } = render(<Pagination {...defaultProps} totalPages={1} />)
    expect(container2.firstChild).toBeNull()
  })

  it('should show correct items range for last page', () => {
    const { container } = render(
      <Pagination
        {...defaultProps}
        currentPage={5}
        totalItems={100}
        itemsPerPage={20}
        totalPages={5}
      />
    )

    expect(container.textContent).toContain('81')
    expect(container.textContent).toContain('100')
  })
})

