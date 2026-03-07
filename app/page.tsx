"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CashSummary from "@/components/CashSummary";
import { Order, Expense } from "@/types";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersResponse, expensesResponse] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/expenses")
        ]);
        
        const ordersData = await ordersResponse.json();
        const expensesData = await expensesResponse.json();
        
        if (Array.isArray(ordersData)) setOrders(ordersData);
        if (Array.isArray(expensesData)) setExpenses(expensesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          3D Print Order Monitoring System
        </h1>
        <p className="text-xl text-gray-600">
          Manage orders, track payments, monitor inventory, generate invoices, and control expenses
        </p>
      </div>

      {/* Cash Summary */}
      <div className="mb-8">
        {loading ? (
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-lg shadow-lg">
            <div className="animate-pulse">
              <div className="h-4 bg-green-300 rounded w-24 mb-2"></div>
              <div className="h-8 bg-green-300 rounded w-32"></div>
            </div>
          </div>
        ) : (
          <CashSummary orders={orders} expenses={expenses} />
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/orders"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-blue-500"
        >
          <div className="text-3xl mb-3">📦</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Orders
          </h2>
          <p className="text-gray-600">
            Monitor orders, track status, and record payments received from customers.
          </p>
        </Link>

        <Link
          href="/inventory"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-green-500"
        >
          <div className="text-3xl mb-3">🎨</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Filament Inventory
          </h2>
          <p className="text-gray-600">
            Track your filament stock levels, colors, types, and manage inventory.
          </p>
        </Link>

        <Link
          href="/invoices"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-purple-500"
        >
          <div className="text-3xl mb-3">🧾</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Invoices
          </h2>
          <p className="text-gray-600">
            Generate and manage invoices for your orders with PDF export capabilities.
          </p>
        </Link>

        <Link
          href="/expenses"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-red-500"
        >
          <div className="text-3xl mb-3">💰</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Expenses
          </h2>
          <p className="text-gray-600">
            Track business expenses including filament, maintenance, electricity, and more.
          </p>
        </Link>
      </div>
    </div>
  );
}
