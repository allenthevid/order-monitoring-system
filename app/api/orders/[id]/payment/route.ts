import { NextResponse } from "next/server";
import { Payment } from "@/types";
import { sql } from "@/lib/db";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const payment: Payment = await request.json();
  
  try {
    // Insert payment
    await sql`
      INSERT INTO payments (order_id, amount, method, date, notes)
      VALUES (${id}, ${payment.amount}, ${payment.method}, ${payment.date}, ${payment.notes || null})
    `;
    
    // Get order price and current amount paid
    const orderData = await sql`
      SELECT price, amount_paid FROM orders WHERE id = ${id}
    `;
    
    if (orderData.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    const order = orderData[0];
    const newAmountPaid = parseFloat(order.amount_paid as string) + payment.amount;
    const price = parseFloat(order.price as string);
    
    // Determine payment status
    let paymentStatus = 'unpaid';
    if (newAmountPaid >= price) {
      paymentStatus = 'paid';
    } else if (newAmountPaid > 0) {
      paymentStatus = 'partial';
    }
    
    // Update order
    await sql`
      UPDATE orders
      SET amount_paid = ${newAmountPaid},
          payment_status = ${paymentStatus},
          updated_at = NOW()
      WHERE id = ${id}
    `;
    
    return NextResponse.json({ success: true, id, payment });
  } catch (error) {
    console.error('Error adding payment:', error);
    return NextResponse.json({ error: 'Failed to add payment' }, { status: 500 });
  }
}
