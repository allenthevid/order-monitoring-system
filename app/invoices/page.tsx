"use client";

import { useState, useEffect } from "react";
import { Invoice, Order } from "@/types";
import InvoiceCard from "@/components/InvoiceCard";
import InvoiceGenerator from "@/components/InvoiceGenerator";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const [invoicesResponse, ordersResponse] = await Promise.all([
          fetch("/api/invoices"),
          fetch("/api/orders")
        ]);
        
        const invoicesData = await invoicesResponse.json();
        const ordersData = await ordersResponse.json();
        
        if (!isMounted) return;
        
        if (Array.isArray(invoicesData)) {
          setInvoices(invoicesData);
        } else {
          setInvoices([]);
        }
        
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else {
          setOrders([]);
        }
      } catch {
        if (isMounted) {
          setInvoices([]);
          setOrders([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

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
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invoices...</p>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
