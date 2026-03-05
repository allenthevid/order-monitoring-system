const { Client } = require('pg');

async function createDatabase() {
  // Get password from command line argument or use default
  const password = process.argv[2] || 'postgres';
  
  console.log('Attempting to connect to PostgreSQL...');
  console.log('Host: localhost:5432');
  console.log('User: postgres');
  console.log('Database: postgres\n');
  
  // Connect to default postgres database
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: password,
    database: 'postgres', // Connect to default database first
  });

  try {
    await client.connect();
    console.log('✓ Connected to PostgreSQL');

    // Check if database exists
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'order_monitoring'"
    );

    if (res.rows.length === 0) {
      // Create the database
      await client.query('CREATE DATABASE order_monitoring');
      console.log('✓ Database "order_monitoring" created successfully');
    } else {
      console.log('✓ Database "order_monitoring" already exists');
    }

    await client.end();
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure PostgreSQL is running');
    console.error('2. Check your credentials (default: user=postgres, password=postgres)');
    console.error('3. Update .env.local if your PostgreSQL credentials are different');
    process.exit(1);
  }
}

createDatabase();
