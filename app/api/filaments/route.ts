import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const filaments = await prisma.filament.findMany({
      orderBy: {
        dateAdded: 'desc'
      }
    });

    const serializedFilaments = filaments.map((filament: any) => ({
      ...filament,
      costPerKg: Number(filament.costPerKg)
    }));

    return NextResponse.json(serializedFilaments);
  } catch (error) {
    console.error('Error fetching filaments:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const filament = await prisma.filament.create({
      data: {
        type: body.type,
        color: body.color,
        brand: body.brand,
        weight: body.weight,
        costPerKg: body.costPerKg,
        supplier: body.supplier,
        dateAdded: new Date(body.dateAdded),
        lowStockThreshold: body.lowStockThreshold || 200
      }
    });

    const serializedFilament = {
      ...filament,
      costPerKg: Number(filament.costPerKg)
    };

    return NextResponse.json(serializedFilament, { status: 201 });
  } catch (error) {
    console.error('Error creating filament:', error);
    return NextResponse.json({ error: 'Failed to create filament' }, { status: 500 });
  }
}
