import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const income = await prisma.income.update({
      where: { id },
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
    console.error("Error updating income:", error);
    return NextResponse.json(
      { error: "Failed to update income" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.income.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting income:", error);
    return NextResponse.json(
      { error: "Failed to delete income" },
      { status: 500 }
    );
  }
}
