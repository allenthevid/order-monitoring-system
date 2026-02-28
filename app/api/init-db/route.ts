import { NextResponse } from "next/server";
import { initializeDatabase, seedDatabase } from "@/lib/init-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { seed } = body;

    await initializeDatabase();
    
    if (seed) {
      await seedDatabase();
    }

    return NextResponse.json({ 
      success: true, 
      message: seed ? 'Database initialized and seeded' : 'Database initialized' 
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize database',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
