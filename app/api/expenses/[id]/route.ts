import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  // In a real app, delete from database
  return NextResponse.json({ success: true, id });
}
