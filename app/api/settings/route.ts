import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'starting_cash_balance' }
    });
    
    const startingBalance = setting ? parseFloat(setting.value) : 0;
    
    return NextResponse.json({ startingBalance });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ startingBalance: 0 });
  }
}

export async function POST(request: Request) {
  try {
    const { startingBalance } = await request.json();
    
    await prisma.setting.upsert({
      where: { key: 'starting_cash_balance' },
      update: {
        value: startingBalance.toString(),
        updatedAt: new Date()
      },
      create: {
        key: 'starting_cash_balance',
        value: startingBalance.toString()
      }
    });
    
    return NextResponse.json({ success: true, startingBalance });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ 
      error: 'Failed to update starting balance',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
