import { NextResponse } from "next/server";
import { Expense } from "@/types";

// In-memory storage (replace with database in production)
let expenses: Expense[] = [
  {
    id: "1",
    description: "PLA Filament - Black (5 rolls)",
    category: "filament",
    amount: 5500.00,
    date: new Date("2026-02-15"),
    vendor: "Amazon",
    notes: "Bulk purchase for next month's orders",
  },
  {
    id: "2",
    description: "3D Printer Nozzle Set",
    category: "parts",
    amount: 1250.00,
    date: new Date("2026-02-20"),
    vendor: "3D Printing Store",
  },
  {
    id: "3",
    description: "Monthly Electricity Bill",
    category: "electricity",
    amount: 4500.00,
    date: new Date("2026-02-01"),
    vendor: "Electric Company",
    notes: "Estimated cost for running printers",
  },
];

export async function GET() {
  return NextResponse.json(expenses);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newExpense: Expense = {
    ...body,
    id: Date.now().toString(),
    date: new Date(body.date),
  };
  expenses.push(newExpense);
  return NextResponse.json(newExpense, { status: 201 });
}
