import { renderHook, act } from '@testing-library/react'
import { usePagination } from '../usePagination'

describe('usePagination', () => {
  const mockData = Array.from({ length: 100 }, (_, i) => ({
    id: `item-${i}`,
    name: `Item ${i}`,
  }))

  it('should initialize with first page', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 20 }))

    expect(result.current.currentPage).toBe(1)
    expect(result.current.totalPages).toBe(5)
    expect(result.current.itemsPerPage).toBe(20)
    expect(result.current.totalItems).toBe(100)
    expect(result.current.paginatedData).toHaveLength(20)
    expect(result.current.paginatedData[0].id).toBe('item-0')
  })

  it('should return correct paginated data for first page', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 20 }))

    expect(result.current.paginatedData).toHaveLength(20)
    expect(result.current.paginatedData[0].id).toBe('item-0')
    expect(result.current.paginatedData[19].id).toBe('item-19')
  })

  it('should navigate to next page', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 20 }))

    act(() => {
      result.current.handlePageChange(2)
    })

    expect(result.current.currentPage).toBe(2)
    expect(result.current.paginatedData).toHaveLength(20)
    expect(result.current.paginatedData[0].id).toBe('item-20')
    expect(result.current.paginatedData[19].id).toBe('item-39')
  })

  it('should navigate to previous page', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 20 }))

    act(() => {
      result.current.handlePageChange(3)
    })

    expect(result.current.currentPage).toBe(3)

    act(() => {
      result.current.handlePageChange(2)
    })

    expect(result.current.currentPage).toBe(2)
    expect(result.current.paginatedData[0].id).toBe('item-20')
  })

  it('should navigate to last page', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 20 }))

    act(() => {
      result.current.handlePageChange(5)
    })

    expect(result.current.currentPage).toBe(5)
    expect(result.current.paginatedData).toHaveLength(20)
    expect(result.current.paginatedData[0].id).toBe('item-80')
    expect(result.current.paginatedData[19].id).toBe('item-99')
  })

  it('should not navigate to invalid pages', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 20 }))

    act(() => {
      result.current.handlePageChange(0)
    })

    expect(result.current.currentPage).toBe(1) // Should remain on page 1

    act(() => {
      result.current.handlePageChange(10) // Beyond total pages
    })

    expect(result.current.currentPage).toBe(1) // Should remain on page 1
  })

  it('should change items per page and reset to first page', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 20 }))

    act(() => {
      result.current.handlePageChange(3)
    })

    expect(result.current.currentPage).toBe(3)

    act(() => {
      result.current.handleItemsPerPageChange(10)
    })

    expect(result.current.currentPage).toBe(1) // Should reset to page 1
    expect(result.current.itemsPerPage).toBe(10)
    expect(result.current.totalPages).toBe(10)
    expect(result.current.paginatedData).toHaveLength(10)
  })

  it('should handle empty data array', () => {
    const { result } = renderHook(() => usePagination({ data: [], itemsPerPage: 20 }))

    expect(result.current.totalPages).toBe(0)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.paginatedData).toHaveLength(0)
    expect(result.current.totalItems).toBe(0)
  })

  it('should handle data smaller than items per page', () => {
    const smallData = Array.from({ length: 5 }, (_, i) => ({ id: `item-${i}`, name: `Item ${i}` }))
    const { result } = renderHook(() => usePagination({ data: smallData, itemsPerPage: 20 }))

    expect(result.current.totalPages).toBe(1)
    expect(result.current.paginatedData).toHaveLength(5)
    expect(result.current.totalItems).toBe(5)
  })

  it('should handle last page with remaining items', () => {
    const { result } = renderHook(() => usePagination({ data: mockData, itemsPerPage: 30 }))

    act(() => {
      result.current.handlePageChange(4)
    })

    // Total pages should be 4 (100 / 30 = 3.33, rounded up to 4)
    expect(result.current.totalPages).toBe(4)
    // Last page should have 10 items (100 - 90 = 10)
    expect(result.current.paginatedData).toHaveLength(10)
    expect(result.current.paginatedData[0].id).toBe('item-90')
    expect(result.current.paginatedData[9].id).toBe('item-99')
  })

  it('should reset to page 1 when current page exceeds total pages after data changes', () => {
    const { result, rerender } = renderHook(
      ({ data }) => usePagination({ data, itemsPerPage: 20 }),
      {
        initialProps: { data: mockData },
      }
    )

    act(() => {
      result.current.handlePageChange(5)
    })

    expect(result.current.currentPage).toBe(5)

    // Simulate data change that reduces total pages
    const reducedData = Array.from({ length: 30 }, (_, i) => ({
      id: `item-${i}`,
      name: `Item ${i}`,
    }))

    rerender({ data: reducedData })

    // Should reset to page 1 or stay within valid range
    expect(result.current.currentPage).toBeLessThanOrEqual(result.current.totalPages)
  })

  it('should use default itemsPerPage of 20 if not provided', () => {
    const { result } = renderHook(() => usePagination({ data: mockData }))

    expect(result.current.itemsPerPage).toBe(20)
    expect(result.current.totalPages).toBe(5)
  })

  it('should correctly calculate total pages', () => {
    const { result: result1 } = renderHook(() =>
      usePagination({ data: mockData, itemsPerPage: 25 })
    )
    expect(result1.current.totalPages).toBe(4) // 100 / 25 = 4

    const { result: result2 } = renderHook(() =>
      usePagination({ data: mockData, itemsPerPage: 33 })
    )
    expect(result2.current.totalPages).toBe(4) // 100 / 33 = 3.03, rounded up to 4
  })
})

