import { NextResponse } from "next/server";
import { Order } from "@/types";

// In-memory storage (replace with database in production)
const orders: Order[] = [
  {
    id: "1",
    customerName: "John Smith",
    email: "john@example.com",
    itemName: "Custom Phone Stand",
    quantity: 2,
    filamentType: "PLA",
    filamentColor: "Black",
    printTime: 4.5,
    price: 1250.00,
    status: "printing",
    orderDate: new Date("2026-02-25"),
    notes: "Customer wants smooth finish",
    payments: [
      {
        amount: 500.00,
        method: "cash",
        date: new Date("2026-02-25"),
        notes: "Partial payment",
      },
    ],
    amountPaid: 500.00,
    paymentStatus: "partial",
  },
  {
    id: "2",
    customerName: "Sarah Johnson",
    email: "sarah@example.com",
    itemName: "Miniature Dragon",
    quantity: 1,
    filamentType: "PLA",
    filamentColor: "Red",
    printTime: 12,
    price: 2250.00,
    status: "pending",
    orderDate: new Date("2026-02-26"),
    payments: [],
    amountPaid: 0,
    paymentStatus: "unpaid",
  },
  {
    id: "3",
    customerName: "Mike Davis",
    email: "mike@example.com",
    itemName: "Desk Organizer",
    quantity: 1,
    filamentType: "PETG",
    filamentColor: "Blue",
    printTime: 6,
    price: 1500.00,
    status: "completed",
    orderDate: new Date("2026-02-20"),
    completionDate: new Date("2026-02-21"),
    payments: [
      {
        amount: 1500.00,
        method: "card",
        date: new Date("2026-02-21"),
        notes: "Full payment on completion",
      },
    ],
    amountPaid: 1500.00,
    paymentStatus: "paid",
  },
];

export async function GET() {
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newOrder: Order = {
    ...body,
    id: Date.now().toString(),
    orderDate: new Date(body.orderDate),
    completionDate: body.completionDate ? new Date(body.completionDate) : undefined,
  };
  orders.push(newOrder);
  return NextResponse.json(newOrder, { status: 201 });
}
