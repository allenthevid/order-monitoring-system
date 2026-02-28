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
