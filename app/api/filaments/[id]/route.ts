import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  
  try {
    // Update filament weight
    if (body.weight !== undefined) {
      await sql`
        UPDATE filaments
        SET weight = ${body.weight},
            updated_at = NOW()
        WHERE id = ${id}
      `;
    }
    
    return NextResponse.json({ success: true, id, ...body });
  } catch (error) {
    console.error('Error updating filament:', error);
    return NextResponse.json({ error: 'Failed to update filament' }, { status: 500 });
  }
}
