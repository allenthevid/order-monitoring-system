import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST() {
  try {
    console.log('Running database migrations...');

    // Add vendor and related_order_id columns if they don't exist
    await sql`
      ALTER TABLE expenses 
      ADD COLUMN IF NOT EXISTS vendor VARCHAR(255),
      ADD COLUMN IF NOT EXISTS related_order_id VARCHAR(255)
    `;

    // Drop the constraint if it exists
    await sql`
      ALTER TABLE expenses 
      DROP CONSTRAINT IF EXISTS expenses_related_order_id_fkey
    `;

    // Add the foreign key constraint with ON DELETE SET NULL
    await sql`
      ALTER TABLE expenses 
      ADD CONSTRAINT expenses_related_order_id_fkey 
      FOREIGN KEY (related_order_id) 
      REFERENCES orders(id) 
      ON DELETE SET NULL
    `;

    // Create settings table
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('✓ Database migrations completed successfully!');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database migrations completed successfully. Orders can now be deleted properly and settings table created.' 
    });
  } catch (error) {
    console.error('Error running migrations:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to run migrations',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
