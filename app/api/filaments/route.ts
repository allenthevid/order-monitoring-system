import { NextResponse } from "next/server";
import { Filament, FilamentType } from "@/types";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const filamentsData = await sql`
      SELECT 
        id,
        type,
        color,
        brand,
        weight,
        cost_per_kg as "costPerKg",
        supplier,
        date_added as "dateAdded",
        low_stock_threshold as "lowStockThreshold"
      FROM filaments
      ORDER BY date_added DESC
    `;

    const filaments: Filament[] = filamentsData.map((f) => ({
      id: f.id as string,
      type: f.type as FilamentType,
      color: f.color as string,
      brand: f.brand as string,
      weight: f.weight as number,
      costPerKg: parseFloat(f.costPerKg as string),
      supplier: f.supplier as string,
      dateAdded: new Date(f.dateAdded as string),
      lowStockThreshold: f.lowStockThreshold as number,
    }));

    return NextResponse.json(filaments);
  } catch (error) {
    console.error('Error fetching filaments:', error);
    return NextResponse.json({ error: 'Failed to fetch filaments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newFilamentId = Date.now().toString();

    await sql`
      INSERT INTO filaments (
        id, type, color, brand, weight, cost_per_kg, 
        supplier, date_added, low_stock_threshold
      )
      VALUES (
        ${newFilamentId}, ${body.type}, ${body.color}, ${body.brand},
        ${body.weight}, ${body.costPerKg}, ${body.supplier},
        ${body.dateAdded}, ${body.lowStockThreshold || 200}
      )
    `;

    const newFilament: Filament = {
      ...body,
      id: newFilamentId,
      dateAdded: new Date(body.dateAdded),
    };

    return NextResponse.json(newFilament, { status: 201 });
  } catch (error) {
    console.error('Error creating filament:', error);
    return NextResponse.json({ error: 'Failed to create filament' }, { status: 500 });
  }
}
