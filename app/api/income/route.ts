import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const income = await prisma.income.findMany({
      orderBy: { date: "desc" },
    });

    return NextResponse.json(income);
  } catch (error) {
    console.error("Error fetching income:", error);
    return NextResponse.json(
      { error: "Failed to fetch income" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.description || typeof body.amount !== 'number' || body.amount < 0) {
      return NextResponse.json(
        { error: "Invalid income data. Description and valid amount are required." },
        { status: 400 }
      );
    }
    
    const income = await prisma.income.create({
      data: {
        description: body.description,
        category: body.category || 'other',
        amount: body.amount,
        date: new Date(body.date),
        customerName: body.customerName || null,
        notes: body.notes || null,
        relatedOrderId: body.relatedOrderId || null,
      },
    });

    return NextResponse.json(income);
  } catch (error) {
    console.error("Error creating income:", error);
    return NextResponse.json(
      { error: "Failed to create income" },
      { status: 500 }
    );
  }
}
