import { NextResponse } from "next/server";
import { Payment } from "@/types";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const payment: Payment = await request.json();
  
  try {
    // Get order
    const order = await prisma.order.findUnique({
      where: { id }
    });
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Create payment
    await prisma.payment.create({
      data: {
        orderId: id,
        amount: payment.amount,
        method: payment.method,
        date: new Date(payment.date),
        notes: payment.notes
      }
    });
    
    // Calculate new amount paid
    const newAmountPaid = Number(order.amountPaid) + payment.amount;
    const price = Number(order.price);
    
    // Determine payment status
    let paymentStatus = 'unpaid';
    if (newAmountPaid >= price) {
      paymentStatus = 'paid';
    } else if (newAmountPaid > 0) {
      paymentStatus = 'partial';
    }
    
    // Update order
    await prisma.order.update({
      where: { id },
      data: {
        amountPaid: newAmountPaid,
        paymentStatus,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json({ success: true, id, payment });
  } catch (error) {
    console.error('Error adding payment:', error);
    return NextResponse.json({ error: 'Failed to add payment' }, { status: 500 });
  }
}
