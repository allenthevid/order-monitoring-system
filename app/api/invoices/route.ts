import { NextResponse } from "next/server";
import { Invoice } from "@/types";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const invoicesData = await sql`
      SELECT 
        id,
        invoice_number as "invoiceNumber",
        order_id as "orderId",
        customer_name as "customerName",
        customer_email as "customerEmail",
        date as "issueDate",
        due_date as "dueDate",
        subtotal,
        tax,
        total,
        status,
        notes
      FROM invoices
      ORDER BY date DESC
    `;

    // Get items for each invoice
    const invoices: Invoice[] = await Promise.all(
      invoicesData.map(async (invoice) => {
        const itemsData = await sql`
          SELECT description, quantity, unit_price as "unitPrice", total
          FROM invoice_items
          WHERE invoice_id = ${invoice.id}
        `;

        return {
          id: invoice.id as string,
          invoiceNumber: invoice.invoiceNumber as string,
          orderId: invoice.orderId as string,
          customerName: invoice.customerName as string,
          customerEmail: invoice.customerEmail as string,
          subtotal: parseFloat(invoice.subtotal as string),
          tax: parseFloat(invoice.tax as string),
          total: parseFloat(invoice.total as string),
          issueDate: new Date(invoice.issueDate as string),
          dueDate: new Date(invoice.dueDate as string),
          status: invoice.status as 'unpaid' | 'paid' | 'overdue',
          notes: invoice.notes as string | undefined,
          items: itemsData.map((item) => ({
            description: item.description as string,
            quantity: item.quantity as number,
            unitPrice: parseFloat(item.unitPrice as string),
            total: parseFloat(item.total as string),
          })),
        };
      })
    );

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    // Return empty array to allow app to function without database
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newInvoiceId = Date.now().toString();

    // Generate invoice number
    const countResult = await sql`SELECT COUNT(*) as count FROM invoices;`;
    const count = parseInt(countResult[0].count as string) + 1;
    const invoiceNumber = `INV-2026-${String(count).padStart(3, "0")}`;

    // Insert invoice
    await sql`
      INSERT INTO invoices (
        id, order_id, invoice_number, customer_name, customer_email,
        date, due_date, subtotal, tax, total, status, notes
      )
      VALUES (
        ${newInvoiceId}, ${body.orderId}, ${invoiceNumber}, 
        ${body.customerName}, ${body.customerEmail},
        ${body.issueDate}, ${body.dueDate}, ${body.subtotal},
        ${body.tax}, ${body.total}, ${body.status || 'draft'},
        ${body.notes || null}
      )
    `;

    // Insert invoice items
    for (const item of body.items) {
      await sql`
        INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total)
        VALUES (
          ${newInvoiceId}, ${item.description}, ${item.quantity},
          ${item.unitPrice}, ${item.total}
        )
      `;
    }

    const newInvoice: Invoice = {
      ...body,
      id: newInvoiceId,
      invoiceNumber,
      issueDate: new Date(body.issueDate),
      dueDate: new Date(body.dueDate),
    };

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
