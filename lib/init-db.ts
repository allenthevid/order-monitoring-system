import { sql } from './db';

export async function initializeDatabase() {
  try {
    console.log('Creating database tables...');

    // Orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        filament_type VARCHAR(50) NOT NULL,
        filament_color VARCHAR(100) NOT NULL,
        print_time DECIMAL(10, 2) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        order_date TIMESTAMP NOT NULL DEFAULT NOW(),
        notes TEXT,
        amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0,
        payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid',
        color_variants JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Payments table
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        method VARCHAR(50) NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT NOW(),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Filaments table
    await sql`
      CREATE TABLE IF NOT EXISTS filaments (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        color VARCHAR(100) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        weight INTEGER NOT NULL,
        cost_per_kg DECIMAL(10, 2) NOT NULL,
        supplier VARCHAR(255) NOT NULL,
        date_added TIMESTAMP NOT NULL DEFAULT NOW(),
        low_stock_threshold INTEGER NOT NULL DEFAULT 200,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Invoices table
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(255) PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        invoice_number VARCHAR(100) NOT NULL UNIQUE,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT NOW(),
        due_date TIMESTAMP NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        tax DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'draft',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Invoice items table
    await sql`
      CREATE TABLE IF NOT EXISTS invoice_items (
        id SERIAL PRIMARY KEY,
        invoice_id VARCHAR(255) NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Expenses table
    await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(255) PRIMARY KEY,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT NOW(),
        vendor VARCHAR(255),
        notes TEXT,
        related_order_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);`;

    console.log('✓ Database tables created successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function seedDatabase() {
  try {
    console.log('Seeding database with sample data...');

    // Check if data already exists
    const existingOrders = await sql`SELECT COUNT(*) as count FROM orders;`;
    if (existingOrders[0].count > 0) {
      console.log('Database already has data, skipping seed.');
      return { success: true, skipped: true };
    }

    // Insert sample orders
    await sql`
      INSERT INTO orders (id, customer_name, email, item_name, quantity, filament_type, filament_color, print_time, price, status, order_date, notes, amount_paid, payment_status)
      VALUES 
        ('1', 'John Smith', 'john@example.com', 'Custom Phone Stand', 1, 'PLA', 'Black', 2.5, 1250.00, 'completed', NOW() - INTERVAL '2 days', 'Customer requested glossy finish', 1250.00, 'paid'),
        ('2', 'Sarah Johnson', 'sarah@example.com', '3D Printed Vase', 2, 'PETG', 'White', 4.0, 2250.00, 'printing', NOW() - INTERVAL '1 day', NULL, 1000.00, 'partial'),
        ('3', 'Mike Davis', 'mike@example.com', 'Miniature Figure Set', 5, 'PLA', 'Red', 3.5, 1500.00, 'pending', NOW(), 'Rush order', 0.00, 'unpaid')
      ON CONFLICT (id) DO NOTHING;
    `;

    // Insert sample payments
    await sql`
      INSERT INTO payments (order_id, amount, method, date, notes)
      VALUES 
        ('1', 1250.00, 'cash', NOW() - INTERVAL '1 day', 'Paid in full'),
        ('2', 1000.00, 'bank_transfer', NOW() - INTERVAL '1 day', 'Partial payment')
      ON CONFLICT DO NOTHING;
    `;

    // Insert sample filaments
    await sql`
      INSERT INTO filaments (id, type, color, brand, weight, cost_per_kg, supplier, date_added, low_stock_threshold)
      VALUES 
        ('1', 'PLA', 'Black', 'Hatchbox', 850, 1100.00, 'Amazon', NOW() - INTERVAL '30 days', 200),
        ('2', 'PLA', 'Red', 'eSun', 650, 1200.00, '3D Printing Store', NOW() - INTERVAL '25 days', 200),
        ('3', 'PETG', 'Blue', 'Overture', 150, 1450.00, 'Amazon', NOW() - INTERVAL '15 days', 200),
        ('4', 'ABS', 'White', 'Hatchbox', 950, 1250.00, 'Direct from Manufacturer', NOW() - INTERVAL '10 days', 200),
        ('5', 'TPU', 'Clear', 'NinjaFlex', 500, 1900.00, '3D Printing Store', NOW() - INTERVAL '5 days', 150)
      ON CONFLICT (id) DO NOTHING;
    `;

    // Insert sample expenses
    await sql`
      INSERT INTO expenses (id, description, category, amount, date, vendor, notes)
      VALUES 
        ('1', 'PLA Filament - Black (5 rolls)', 'filament', 5500.00, NOW() - INTERVAL '5 days', 'Amazon', 'Bulk purchase for next month''s orders'),
        ('2', '3D Printer Nozzle Set', 'parts', 1250.00, NOW() - INTERVAL '3 days', '3D Printing Store', NULL),
        ('3', 'Monthly Electricity Bill', 'electricity', 4500.00, NOW() - INTERVAL '1 day', 'Electric Company', 'Estimated cost for running printers')
      ON CONFLICT (id) DO NOTHING;
    `;

    console.log('✓ Database seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
