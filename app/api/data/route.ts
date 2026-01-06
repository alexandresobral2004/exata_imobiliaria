import { NextRequest, NextResponse } from 'next/server';
import {
  OwnersRepository,
  PropertiesRepository,
  TenantsRepository,
  BrokersRepository,
  ContractsRepository,
  FinancialRepository,
  UsersRepository
} from '@/lib/repositories';

// Helper function to get fresh repository instances
function getRepositories() {
  return {
    owners: new OwnersRepository(),
    properties: new PropertiesRepository(),
    tenants: new TenantsRepository(),
    brokers: new BrokersRepository(),
    contracts: new ContractsRepository(),
    financial: new FinancialRepository(),
    users: new UsersRepository()
  };
}

export async function GET(request: NextRequest) {
  try {
    const repos = getRepositories();
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!entity) {
      // Return all data (for initial load - consider deprecating this)
      return NextResponse.json({
        owners: repos.owners.findAll(),
        properties: repos.properties.findAll(),
        tenants: repos.tenants.findAll(),
        brokers: repos.brokers.findAll(),
        contracts: repos.contracts.findAll(),
        financialRecords: month && year 
          ? repos.financial.findByMonth(parseInt(month), parseInt(year))
          : repos.financial.findAll(),
        categories: repos.financial.getAllCategories(),
        users: repos.users.findAll()
      });
    }

    // Return specific entity data with pagination support
    switch (entity) {
      case 'owners':
        return NextResponse.json(repos.owners.findAll());
      case 'properties':
        return NextResponse.json(repos.properties.findAll());
      case 'tenants':
        return NextResponse.json(repos.tenants.findAll());
      case 'brokers':
        return NextResponse.json(repos.brokers.findAll());
      case 'contracts':
        return NextResponse.json(repos.contracts.findAll());
      case 'financial': {
        // Support pagination and month filter
        if (month && year) {
          const records = repos.financial.findByMonth(parseInt(month), parseInt(year));
          return NextResponse.json({ data: records, total: records.length });
        }
        
        const offset = (page - 1) * limit;
        const records = repos.financial.findPaginated(offset, limit);
        const total = repos.financial.count();
        
        return NextResponse.json({
          data: records,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        });
      }
      case 'financial-summary': {
        // Get monthly summary
        const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
        const currentYear = year ? parseInt(year) : new Date().getFullYear();
        const summary = repos.financial.getMonthlySummary(currentMonth, currentYear);
        return NextResponse.json(summary);
      }
      case 'categories':
        return NextResponse.json(repos.financial.getAllCategories());
      case 'users':
        return NextResponse.json(repos.users.findAll());
      default:
        return NextResponse.json({ error: 'Unknown entity' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const repos = getRepositories();
    const body = await request.json();
    const { entity, data } = body;

    if (!entity || !data) {
      return NextResponse.json({ error: 'Missing entity or data' }, { status: 400 });
    }

    let result;
    switch (entity) {
      case 'owners':
        result = repos.owners.create(data);
        break;
      case 'properties':
        result = repos.properties.create(data);
        break;
      case 'tenants':
        result = repos.tenants.create(data);
        break;
      case 'brokers':
        result = repos.brokers.create(data);
        break;
      case 'contracts':
        result = repos.contracts.create(data);
        break;
      case 'financial':
        result = repos.financial.create(data);
        break;
      case 'categories':
        result = repos.financial.addCategory(data);
        break;
      case 'users':
        result = repos.users.create(data);
        break;
      default:
        return NextResponse.json({ error: 'Unknown entity' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating data:', error);
    return NextResponse.json({ error: 'Failed to create data' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const repos = getRepositories();
    const body = await request.json();
    const { entity, id, updates } = body;

    if (!entity || !id || !updates) {
      return NextResponse.json({ error: 'Missing entity, id, or updates' }, { status: 400 });
    }

    let result;
    switch (entity) {
      case 'owners':
        result = repos.owners.update(id, updates);
        break;
      case 'properties':
        result = repos.properties.update(id, updates);
        break;
      case 'tenants':
        result = repos.tenants.update(id, updates);
        break;
      case 'brokers':
        result = repos.brokers.update(id, updates);
        break;
      case 'contracts':
        result = repos.contracts.update(id, updates);
        break;
      case 'financial':
        result = repos.financial.update(id, updates);
        break;
      case 'users':
        result = repos.users.update(id, updates);
        break;
      default:
        return NextResponse.json({ error: 'Unknown entity' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const repos = getRepositories();
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');
    const id = searchParams.get('id');

    if (!entity || !id) {
      return NextResponse.json({ error: 'Missing entity or id' }, { status: 400 });
    }

    switch (entity) {
      case 'owners':
        repos.owners.delete(id);
        break;
      case 'properties':
        repos.properties.delete(id);
        break;
      case 'tenants':
        repos.tenants.delete(id);
        break;
      case 'brokers':
        repos.brokers.delete(id);
        break;
      case 'contracts':
        repos.contracts.delete(id);
        break;
      case 'financial':
        repos.financial.delete(id);
        break;
      case 'users':
        repos.users.delete(id);
        break;
      default:
        return NextResponse.json({ error: 'Unknown entity' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}

