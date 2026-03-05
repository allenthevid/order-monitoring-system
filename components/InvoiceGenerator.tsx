"use client";

import { useState } from "react";
import { Invoice, Order, InvoiceItem } from "@/types";
import { addDays } from "date-fns";

interface InvoiceGeneratorProps {
  orders: Order[];
  onGenerate: (invoice: Omit<Invoice, "id" | "invoiceNumber">) => void;
}

export default function InvoiceGenerator({
  orders,
  onGenerate,
}: InvoiceGeneratorProps) {
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [taxRate, setTaxRate] = useState(0.1); // 10% default
  const [dueInDays, setDueInDays] = useState(30);
  const [notes, setNotes] = useState("");

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const items: InvoiceItem[] = [
      {
        description: `${selectedOrder.itemName} (${selectedOrder.filamentColor} ${selectedOrder.filamentType}) - ${selectedOrder.printTime}h print time`,
        quantity: selectedOrder.quantity,
        unitPrice: selectedOrder.price / selectedOrder.quantity,
        total: selectedOrder.price,
      },
    ];

    const subtotal = selectedOrder.price;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const issueDate = new Date();
    const dueDate = addDays(issueDate, dueInDays);

    onGenerate({
      orderId: selectedOrder.id,
      customerName: selectedOrder.customerName,
      customerEmail: selectedOrder.email,
      issueDate,
      dueDate,
      items,
      subtotal,
      tax,
      total,
      status: "unpaid",
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Invoice</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Order *
          </label>
          <select
            required
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">-- Select a completed order --</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.itemName} - {order.customerName} - ₱
                {order.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {selectedOrder && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Order Details:</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Customer:</span>{" "}
                {selectedOrder.customerName}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {selectedOrder.email}
              </p>
              <p>
                <span className="font-medium">Item:</span>{" "}
                {selectedOrder.itemName}
              </p>
              <p>
                <span className="font-medium">Quantity:</span>{" "}
                {selectedOrder.quantity}
              </p>
              <p>
                <span className="font-medium">Print Time:</span>{" "}
                {selectedOrder.printTime}h
              </p>
              <p>
                <span className="font-medium">Price:</span> ₱
                {selectedOrder.price.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Rate (%) *
            </label>
            <input
              type="number"
              required
              min="0"
              max="100"
              step="0.1"
              value={taxRate * 100}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) / 100)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due in Days *
            </label>
            <input
              type="number"
              required
              min="1"
              value={dueInDays}
              onChange={(e) => setDueInDays(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {selectedOrder && (
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Invoice Summary:</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₱{selectedOrder.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({(taxRate * 100).toFixed(1)}%):</span>
                <span>₱{(selectedOrder.price * taxRate).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-1">
                <span>Total:</span>
                <span>
                  ₱{(selectedOrder.price * (1 + taxRate)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Payment terms, additional information..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!selectedOrder}
        className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Generate Invoice
      </button>
    </form>
  );
}
