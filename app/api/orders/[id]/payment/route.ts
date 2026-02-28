import { NextResponse } from "next/server";
import { Payment } from "@/types";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const payment: Payment = await request.json();
  
  // In a real app, update the database
  // Add payment to order.payments array
  // Update order.amountPaid
  // Update order.paymentStatus based on amountPaid vs price
  
  return NextResponse.json({ success: true, id, payment });
}
