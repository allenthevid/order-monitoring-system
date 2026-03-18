#!/usr/bin/env node

// Script to check database connectivity and schema status
// Run this to verify your production database is ready

const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Checking database connection...');

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if tables exist
    const tables = [
      'income',
      'orders',
      'expenses',
      'filaments',
      'products',
      'invoices'
    ];

    console.log('\n📋 Checking tables...');
    for (const table of tables) {
      try {
        // Use raw query to check table existence
        const result = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "${table}"`);
        const count = parseInt(result[0].count);
        console.log(`✅ ${table}: ${count} records`);
      } catch (error) {
        console.log(`❌ ${table}: Table does not exist`);
      }
    }

    console.log('\n🎉 Database check complete!');

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();