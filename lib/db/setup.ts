#!/usr/bin/env tsx

import { initializeDatabase } from './client';
import { seedDatabase } from './seed';

async function main() {
  try {
    console.log('🚀 Initializing EXATA Database...\n');
    
    // Initialize schema
    initializeDatabase();
    
    // Seed data
    seedDatabase();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('📁 Database file: exata.db');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

main();

