import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  
  try {
    await sql`
      UPDATE orders
      SET status = ${body.status},
          updated_at = NOW()
      WHERE id = ${id}
    `;
    
    return NextResponse.json({ success: true, id, ...body });
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
    // Delete order (payments will be cascade deleted due to foreign key)
    await sql`
      DELETE FROM orders
      WHERE id = ${id}
    `;
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
