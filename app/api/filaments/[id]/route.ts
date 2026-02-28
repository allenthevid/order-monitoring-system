import { NextResponse } from "next/server";
import { Filament } from "@/types";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  
  // In a real app, update the database
  // For now, just return success
  return NextResponse.json({ success: true, id, ...body });
}
