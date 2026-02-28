import { NextResponse } from "next/server";
import { Filament } from "@/types";

// In-memory storage (replace with database in production)
const filaments: Filament[] = [
  {
    id: "1",
    type: "PLA",
    color: "Black",
    brand: "Hatchbox",
    weight: 850,
    costPerKg: 1100.00,
    supplier: "Amazon",
    dateAdded: new Date("2026-01-15"),
    lowStockThreshold: 200,
  },
  {
    id: "2",
    type: "PLA",
    color: "Red",
    brand: "eSun",
    weight: 650,
    costPerKg: 1200.00,
    supplier: "3D Printing Store",
    dateAdded: new Date("2026-01-20"),
    lowStockThreshold: 200,
  },
  {
    id: "3",
    type: "PETG",
    color: "Blue",
    brand: "Overture",
    weight: 150,
    costPerKg: 1450.00,
    supplier: "Amazon",
    dateAdded: new Date("2026-02-01"),
    lowStockThreshold: 200,
  },
  {
    id: "4",
    type: "ABS",
    color: "White",
    brand: "Hatchbox",
    weight: 950,
    costPerKg: 1250.00,
    supplier: "Direct from Manufacturer",
    dateAdded: new Date("2026-02-10"),
    lowStockThreshold: 200,
  },
  {
    id: "5",
    type: "TPU",
    color: "Clear",
    brand: "NinjaFlex",
    weight: 500,
    costPerKg: 1900.00,
    supplier: "3D Printing Store",
    dateAdded: new Date("2026-02-15"),
    lowStockThreshold: 150,
  },
];

export async function GET() {
  return NextResponse.json(filaments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newFilament: Filament = {
    ...body,
    id: Date.now().toString(),
    dateAdded: new Date(body.dateAdded),
  };
  filaments.push(newFilament);
  return NextResponse.json(newFilament, { status: 201 });
}
