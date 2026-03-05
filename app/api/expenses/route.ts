import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    const serializedExpenses = expenses.map((expense: any) => ({
      ...expense,
      amount: Number(expense.amount)
    }));

    return NextResponse.json(serializedExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const expense = await prisma.expense.create({
      data: {
        description: body.description,
        category: body.category,
        amount: body.amount,
        date: new Date(body.date),
        vendor: body.vendor,
        notes: body.notes,
        relatedOrderId: body.relatedOrderId
      }
    });

    const serializedExpense = {
      ...expense,
      amount: Number(expense.amount)
    };

    return NextResponse.json(serializedExpense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
