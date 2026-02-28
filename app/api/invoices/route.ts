import { NextResponse } from "next/server";
import { Invoice } from "@/types";

// In-memory storage (replace with database in production)
let invoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2026-001",
    orderId: "3",
    customerName: "Mike Davis",
    customerEmail: "mike@example.com",
    issueDate: new Date("2026-02-21"),
    dueDate: new Date("2026-03-23"),
    items: [
      {
        description: "Desk Organizer (Blue PETG)",
        quantity: 1,
        unitPrice: 1500.00,
        total: 1500.00,
      },
    ],
    subtotal: 1500.00,
    tax: 150.00,
    total: 1650.00,
    status: "paid",
    notes: "Thank you for your business!",
  },
];

let invoiceCounter = 1;

export async function GET() {
  return NextResponse.json(invoices);
}

export async function POST(request: Request) {
  const body = await request.json();
  invoiceCounter++;
  const newInvoice: Invoice = {
    ...body,
    id: Date.now().toString(),
    invoiceNumber: `INV-2026-${String(invoiceCounter).padStart(3, "0")}`,
    issueDate: new Date(body.issueDate),
    dueDate: new Date(body.dueDate),
  };
  invoices.push(newInvoice);
  return NextResponse.json(newInvoice, { status: 201 });
}
