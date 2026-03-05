import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        payments: {
          orderBy: {
            date: 'desc'
          }
        }
      },
      orderBy: {
        orderDate: 'desc'
      }
    });

    // Convert Decimal to number for JSON serialization
    const serializedOrders = orders.map((order: any) => ({
      ...order,
      price: Number(order.price),
      printTime: Number(order.printTime),
      amountPaid: Number(order.amountPaid),
      colorVariants: order.colorVariants ? JSON.parse(order.colorVariants) : null,
      payments: order.payments.map((p: any) => ({
        ...p,
        amount: Number(p.amount)
      }))
    }));

    return NextResponse.json(serializedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        email: body.email || '',
        itemName: body.itemName,
        quantity: body.quantity,
        filamentType: body.filamentType,
        filamentColor: body.filamentColor,
        printTime: body.printTime || 0,
        price: body.price,
        status: body.status || 'pending',
        orderDate: body.orderDate ? new Date(body.orderDate) : new Date(),
        notes: body.notes,
        amountPaid: body.amountPaid || 0,
        paymentStatus: body.paymentStatus || 'unpaid',
        colorVariants: body.colorVariants ? JSON.stringify(body.colorVariants) : null,
      },
      include: {
        payments: true
      }
    });

    const serializedOrder = {
      ...order,
      price: Number(order.price),
      printTime: Number(order.printTime),
      amountPaid: Number(order.amountPaid),
      colorVariants: order.colorVariants ? JSON.parse(order.colorVariants) : null,
      payments: order.payments.map((p: any) => ({
        ...p,
        amount: Number(p.amount)
      }))
    };

    return NextResponse.json(serializedOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
