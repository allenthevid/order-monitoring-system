const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function testQuery() {
  const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:Ys2b7123@localhost:5432/order_monitoring";
  
  console.log('Testing database connection...');
  console.log('URL:', databaseUrl.replace(/:[^:@]+@/, ':****@'));
  
  try {
    const pool = new Pool({ 
      connectionString: databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    
    console.log('\n1. Testing connection...');
    await prisma.$connect();
    console.log('✓ Connected successfully');
    
    console.log('\n2. Testing simple query...');
    const count = await prisma.order.count();
    console.log(`✓ Found ${count} orders in database`);
    
    if (count > 0) {
      console.log('\n3. Fetching orders...');
      const orders = await prisma.order.findMany({
        take: 5,
        orderBy: { orderDate: 'desc' }
      });
      console.log(`✓ Successfully fetched ${orders.length} orders`);
    }
    
    console.log('\n4. Testing orders with payments...');
    const ordersWithPayments = await prisma.order.findMany({
      include: {
        payments: {
          orderBy: { date: 'desc' }
        }
      },
      take: 5,
      orderBy: { orderDate: 'desc' }
    });
    console.log(`✓ Successfully fetched ${ordersWithPayments.length} orders with payments`);
    
    await prisma.$disconnect();
    await pool.end();
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testQuery();
