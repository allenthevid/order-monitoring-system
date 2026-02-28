"use client";

import { useState, useEffect } from "react";
import { Invoice, Order } from "@/types";
import InvoiceCard from "@/components/InvoiceCard";
import InvoiceGenerator from "@/components/InvoiceGenerator";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchOrders();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      const data = await response.json();
      if (Array.isArray(data)) {
        setInvoices(data);
      } else {
        console.error('Invoices API did not return an array:', data);
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data.filter((o: Order) => o.status === "completed"));
      } else {
        console.error('Orders API did not return an array:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const handleGenerateInvoice = async (invoice: Omit<Invoice, "id" | "invoiceNumber">) => {
    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoice),
    });
    const newInvoice = await response.json();
    setInvoices([...invoices, newInvoice]);
    setShowGenerator(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          {showGenerator ? "Cancel" : "Generate Invoice"}
        </button>
      </div>

      {showGenerator && (
        <div className="mb-6">
          <InvoiceGenerator
            orders={orders}
            onGenerate={handleGenerateInvoice}
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {invoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}
      </div>

      {invoices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No invoices generated yet. Create your first invoice!
        </div>
      )}
    </div>
  );
}
