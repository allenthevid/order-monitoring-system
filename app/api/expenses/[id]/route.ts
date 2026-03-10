import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  try {
    const body = await request.json();
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        description: body.description,
        category: body.category,
        amount: body.amount,
        date: new Date(body.date),
        vendor: body.vendor || null,
        notes: body.notes || null,
        relatedOrderId: body.relatedOrderId || null,
      },
    });
    
    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  try {
    await prisma.expense.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
