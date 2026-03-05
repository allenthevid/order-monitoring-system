import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        items: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    const serializedInvoices = invoices.map((invoice: any) => ({
      ...invoice,
      issueDate: invoice.date,
      subtotal: Number(invoice.subtotal),
      tax: Number(invoice.tax),
      total: Number(invoice.total),
      items: invoice.items.map((item: any) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        total: Number(item.total)
      }))
    }));

    return NextResponse.json(serializedInvoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate invoice number
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-2026-${String(count + 1).padStart(3, "0")}`;

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        orderId: body.orderId,
        invoiceNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        date: new Date(body.issueDate),
        dueDate: new Date(body.dueDate),
        subtotal: body.subtotal,
        tax: body.tax,
        total: body.total,
        status: body.status || 'draft',
        notes: body.notes,
        items: {
          create: body.items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total
          }))
        }
      },
      include: {
        items: true
      }
    });

    const serializedInvoice = {
      ...invoice,
      issueDate: invoice.date,
      subtotal: Number(invoice.subtotal),
      tax: Number(invoice.tax),
      total: Number(invoice.total),
      items: invoice.items.map((item: any) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        total: Number(item.total)
      }))
    };

    return NextResponse.json(serializedInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
