import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock repositories
const mockOwnersRepo = {
  findAll: vi.fn(() => [{ id: '1', name: 'Test Owner' }]),
  findById: vi.fn((id: string) => (id === '1' ? { id: '1', name: 'Test Owner' } : null)),
  create: vi.fn((data: any) => ({ id: '2', ...data })),
  update: vi.fn((id: string, data: any) => ({ id, ...data })),
  delete: vi.fn(),
}

const mockPropertiesRepo = {
  findAll: vi.fn(() => []),
  update: vi.fn(),
}

const mockTenantsRepo = {
  findAll: vi.fn(() => []),
}

const mockBrokersRepo = {
  findAll: vi.fn(() => []),
  findById: vi.fn(() => ({ id: '1', name: 'Broker', commissionRate: 10 })),
}

const mockContractsRepo = {
  findAll: vi.fn(() => []),
  create: vi.fn((data: any) => ({ id: '1', ...data })),
  findById: vi.fn(() => ({ id: '1', propertyId: '1' })),
}

const mockFinancialRepo = {
  findAll: vi.fn(() => []),
  findByMonth: vi.fn(() => []),
  findPaginated: vi.fn(() => []),
  count: vi.fn(() => 0),
  getCategories: vi.fn(() => []),
  getAllCategories: vi.fn(() => []),
  getMonthlySummary: vi.fn(() => ({
    totalReceivables: 1000,
    totalPaid: 500,
    totalCommissions: 100,
  })),
  getAggregatedReceivables: vi.fn(() => ({ Aluguel: 1000 })),
  getAggregatedPaid: vi.fn(() => ({ Aluguel: 500 })),
  getAggregatedCommissionsByBroker: vi.fn(() => ({ 'Broker 1': 100 })),
  create: vi.fn((data: any) => ({ id: '1', ...data })),
  addCategory: vi.fn((data: any) => ({ id: '1', ...data })),
}

const mockUsersRepo = {
  findAll: vi.fn(() => []),
}

// Mock the repositories module
vi.mock('@/lib/repositories', () => ({
  OwnersRepository: class { constructor() { return mockOwnersRepo } },
  PropertiesRepository: class { constructor() { return mockPropertiesRepo } },
  TenantsRepository: class { constructor() { return mockTenantsRepo } },
  BrokersRepository: class { constructor() { return mockBrokersRepo } },
  ContractsRepository: class { constructor() { return mockContractsRepo } },
  FinancialRepository: class { constructor() { return mockFinancialRepo } },
  UsersRepository: class { constructor() { return mockUsersRepo } },
}))

// Mock database client
vi.mock('@/lib/db/client', () => ({
  getDatabase: vi.fn(),
}))

// Import after mocks
import { GET, POST, PUT, DELETE } from '../route'

describe('API Route /api/data', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('should return all owners when entity=owners', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=owners')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([{ id: '1', name: 'Test Owner' }])
      expect(mockOwnersRepo.findAll).toHaveBeenCalled()
    })

    it('should return owner by id', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=owners&id=1')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ id: '1', name: 'Test Owner' })
      expect(mockOwnersRepo.findById).toHaveBeenCalledWith('1')
    })

    it('should return 404 when owner not found', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=owners&id=999')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.message).toContain('not found')
    })

    it('should return all properties when entity=properties', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=properties')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockPropertiesRepo.findAll).toHaveBeenCalled()
    })

    it('should return all tenants when entity=tenants', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=tenants')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockTenantsRepo.findAll).toHaveBeenCalled()
    })

    it('should return all brokers when entity=brokers', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=brokers')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockBrokersRepo.findAll).toHaveBeenCalled()
    })

    it('should return all contracts when entity=contracts', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=contracts')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockContractsRepo.findAll).toHaveBeenCalled()
    })

    it('should return financial data with month filter', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=financial&month=1&year=2026')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('data')
      expect(data).toHaveProperty('total')
    })

    it('should return all users when entity=users', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=users')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockUsersRepo.findAll).toHaveBeenCalled()
    })

    it('should return 400 for invalid entity', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=invalid')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain('Invalid entity')
    })

    it('should handle errors gracefully', async () => {
      mockOwnersRepo.findAll.mockImplementationOnce(() => {
        throw new Error('Database error')
      })

      const request = new NextRequest('http://localhost:3000/api/data?entity=owners')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toContain('Database error')
    })
  })

  describe('POST', () => {
    it('should create a new owner', async () => {
      const ownerData = { name: 'New Owner', document: '12345678900' }
      const request = new NextRequest('http://localhost:3000/api/data', {
        method: 'POST',
        body: JSON.stringify({ entity: 'owners', data: ownerData }),
        headers: { 'Content-Type': 'application/json' },
      })
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('2')
      expect(mockOwnersRepo.create).toHaveBeenCalled()
    })

    it('should create a new contract and generate financial records', async () => {
      const contractData = {
        propertyId: '1',
        tenantId: '1',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        rentAmount: 1000,
        brokerId: '1',
      }
      const request = new NextRequest('http://localhost:3000/api/data', {
        method: 'POST',
        body: JSON.stringify({ entity: 'contracts', data: contractData }),
        headers: { 'Content-Type': 'application/json' },
      })
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockContractsRepo.create).toHaveBeenCalled()
    })

    it('should return 400 for invalid entity on POST', async () => {
      const request = new NextRequest('http://localhost:3000/api/data', {
        method: 'POST',
        body: JSON.stringify({ entity: 'invalid', data: {} }),
      })
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain('Unknown entity')
    })

    it('should handle POST errors gracefully', async () => {
      mockOwnersRepo.create.mockImplementationOnce(() => {
        throw new Error('Creation error')
      })

      const request = new NextRequest('http://localhost:3000/api/data', {
        method: 'POST',
        body: JSON.stringify({ entity: 'owners', data: { name: 'Test' } }),
      })
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Failed to create data')
    })
  })

  describe('PUT', () => {
    it('should update an owner', async () => {
      const updateData = { name: 'Updated Owner' }
      const request = new NextRequest('http://localhost:3000/api/data', {
        method: 'PUT',
        body: JSON.stringify({ entity: 'owners', id: '1', updates: updateData }),
        headers: { 'Content-Type': 'application/json' },
      })
      
      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('1')
      expect(mockOwnersRepo.update).toHaveBeenCalledWith('1', updateData)
    })

    it('should return 400 when id is missing on PUT', async () => {
      const request = new NextRequest('http://localhost:3000/api/data', {
        method: 'PUT',
        body: JSON.stringify({ entity: 'owners', updates: { name: 'Test' } }),
      })
      
      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain('Missing entity, id, or updates')
    })

    it('should return 400 for invalid entity on PUT', async () => {
      const request = new NextRequest('http://localhost:3000/api/data', {
        method: 'PUT',
        body: JSON.stringify({ entity: 'invalid', id: '1', updates: {} }),
      })
      
      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain('Unknown entity')
    })

    it('should handle PUT errors gracefully', async () => {
      mockOwnersRepo.update.mockImplementationOnce(() => {
        throw new Error('Update error')
      })

      const request = new NextRequest('http://localhost:3000/api/data', {
        method: 'PUT',
        body: JSON.stringify({ entity: 'owners', id: '1', updates: { name: 'Test' } }),
      })
      
      const response = await PUT(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Failed to update data')
    })
  })

  describe('DELETE', () => {
    it('should delete an owner', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=owners&id=1', {
        method: 'DELETE',
      })
      
      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockOwnersRepo.delete).toHaveBeenCalledWith('1')
    })

    it('should return 400 when id is missing on DELETE', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=owners', {
        method: 'DELETE',
      })
      
      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain('Missing entity or id')
    })

    it('should return 400 for invalid entity on DELETE', async () => {
      const request = new NextRequest('http://localhost:3000/api/data?entity=invalid&id=1', {
        method: 'DELETE',
      })
      
      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain('Unknown entity')
    })

    it('should handle DELETE errors gracefully', async () => {
      mockOwnersRepo.delete.mockImplementationOnce(() => {
        throw new Error('Delete error')
      })

      const request = new NextRequest('http://localhost:3000/api/data?entity=owners&id=1', {
        method: 'DELETE',
      })
      
      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Failed to delete data')
    })
  })
})
