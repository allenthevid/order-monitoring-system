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
    
    const income = await prisma.income.create({
      data: {
        description: body.description,
        category: body.category,
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
