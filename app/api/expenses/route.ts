import { NextResponse } from "next/server";
import { Expense, ExpenseCategory } from "@/types";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const expensesData = await sql`
      SELECT 
        id,
        description,
        category,
        amount,
        date,
        vendor,
        notes,
        related_order_id as "relatedOrderId"
      FROM expenses
      ORDER BY date DESC
    `;

    const expenses: Expense[] = expensesData.map((e) => ({
      id: e.id as string,
      description: e.description as string,
      category: e.category as ExpenseCategory,
      amount: parseFloat(e.amount as string),
      date: new Date(e.date as string),
      vendor: e.vendor as string | undefined,
      notes: e.notes as string | undefined,
      relatedOrderId: e.relatedOrderId as string | undefined,
    }));

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    // Return empty array to allow app to function without database
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newExpenseId = Date.now().toString();

    await sql`
      INSERT INTO expenses (
        id, description, category, amount, date, vendor, notes, related_order_id
      )
      VALUES (
        ${newExpenseId}, ${body.description}, ${body.category}, 
        ${body.amount}, ${body.date}, ${body.vendor || null}, 
        ${body.notes || null}, ${body.relatedOrderId || null}
      )
    `;

    const newExpense: Expense = {
      ...body,
      id: newExpenseId,
      date: new Date(body.date),
    };

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
