import { NextResponse } from "next/server";
import { Order, ColorVariant, PaymentMethod } from "@/types";
import { sql } from "@/lib/db";
import { initializeDatabase, seedDatabase } from "@/lib/init-db";

// Initialize database on first request
let dbInitialized = false;

async function ensureDb() {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      await seedDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }
}

export async function GET() {
  await ensureDb();
  
  try {
    // Get all orders
    const ordersData = await sql`
      SELECT 
        id,
        customer_name as "customerName",
        email,
        item_name as "itemName",
        quantity,
        filament_type as "filamentType",
        filament_color as "filamentColor",
        print_time as "printTime",
        price,
        status,
        order_date as "orderDate",
        notes,
        amount_paid as "amountPaid",
        payment_status as "paymentStatus",
        color_variants as "colorVariants"
      FROM orders
      ORDER BY order_date DESC
    `;

    // Get payments for each order
    const orders: Order[] = await Promise.all(
      ordersData.map(async (order) => {
        const paymentsData = await sql`
          SELECT amount, method, date, notes
          FROM payments
          WHERE order_id = ${order.id}
          ORDER BY date DESC
        `;

        return {
          id: order.id as string,
          customerName: order.customerName as string,
          email: order.email as string,
          itemName: order.itemName as string,
          quantity: order.quantity as number,
          filamentType: order.filamentType as string,
          filamentColor: order.filamentColor as string,
          price: parseFloat(order.price as string),
          printTime: parseFloat(order.printTime as string),
          amountPaid: parseFloat(order.amountPaid as string),
          orderDate: new Date(order.orderDate as string),
          status: order.status as 'pending' | 'printing' | 'completed' | 'cancelled',
          paymentStatus: order.paymentStatus as 'unpaid' | 'partial' | 'paid',
          notes: order.notes as string | undefined,
          colorVariants: order.colorVariants as ColorVariant[] | undefined,
          payments: paymentsData.map((p) => ({
            amount: parseFloat(p.amount as string),
            method: p.method as PaymentMethod,
            date: new Date(p.date as string),
            notes: p.notes as string | undefined,
          })),
        };
      })
    );

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureDb();
  
  try {
    const body = await request.json();
    const newOrderId = Date.now().toString();

    await sql`
      INSERT INTO orders (
        id, customer_name, email, item_name, quantity, 
        filament_type, filament_color, print_time, price, 
        status, order_date, notes, amount_paid, payment_status,
        color_variants
      )
      VALUES (
        ${newOrderId}, ${body.customerName}, ${body.email}, 
        ${body.itemName}, ${body.quantity}, ${body.filamentType},
        ${body.filamentColor}, ${body.printTime}, ${body.price},
        ${body.status || 'pending'}, ${body.orderDate}, ${body.notes || null},
        ${body.amountPaid || 0}, ${body.paymentStatus || 'unpaid'},
        ${body.colorVariants ? JSON.stringify(body.colorVariants) : null}
      )
    `;

    const newOrder: Order = {
      ...body,
      id: newOrderId,
      orderDate: new Date(body.orderDate),
      payments: [],
    };

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
