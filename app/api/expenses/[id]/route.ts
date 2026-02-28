import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  try {
    await sql`
      DELETE FROM expenses
      WHERE id = ${id}
    `;
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
