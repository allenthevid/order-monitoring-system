import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  
  try {
    await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json({ success: true, id, ...body });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  
  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        customerName: body.customerName,
        email: body.email || '',
        itemName: body.itemName,
        quantity: body.quantity,
        filamentType: body.filamentType,
        filamentColor: body.filamentColor,
        printTime: body.printTime || 0,
        price: body.price,
        notes: body.notes,
        colorVariants: body.colorVariants ? JSON.stringify(body.colorVariants) : null,
        updatedAt: new Date()
      },
      include: {
        payments: true
      }
    });

    const serializedOrder = {
      ...updatedOrder,
      price: Number(updatedOrder.price),
      printTime: Number(updatedOrder.printTime),
      amountPaid: Number(updatedOrder.amountPaid),
      colorVariants: updatedOrder.colorVariants ? JSON.parse(updatedOrder.colorVariants) : null,
      payments: updatedOrder.payments.map((p: any) => ({
        ...p,
        amount: Number(p.amount)
      }))
    };
    
    return NextResponse.json(serializedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  try {
    // Update related expenses to set order reference to null
    await prisma.expense.updateMany({
      where: { relatedOrderId: id },
      data: { relatedOrderId: null }
    });
    
    // Delete order (payments will be cascade deleted)
    const deletedOrder = await prisma.order.delete({
      where: { id }
    });
    
    if (!deletedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ 
      error: 'Failed to delete order',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
