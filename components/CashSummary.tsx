"use client";

import { useState, useEffect } from "react";
import { Order, Expense } from "@/types";

export default function CashSummary() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [startingBalance, setStartingBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("0");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersResponse, expensesResponse, settingsResponse] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/expenses"),
        fetch("/api/settings"),
      ]);
      
      const ordersData = await ordersResponse.json();
      const expensesData = await expensesResponse.json();
      const settingsData = await settingsResponse.json();
      
      if (Array.isArray(ordersData)) setOrders(ordersData);
      if (Array.isArray(expensesData)) setExpenses(expensesData);
      if (settingsData.startingBalance !== undefined) {
        setStartingBalance(settingsData.startingBalance);
        setEditValue(settingsData.startingBalance.toString());
      }
    } catch (error) {
      console.error("Error fetching cash data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStartingBalance = async () => {
    try {
      const newBalance = parseFloat(editValue) || 0;
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startingBalance: newBalance }),
      });
      setStartingBalance(newBalance);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving starting balance:", error);
      alert("Failed to save starting balance");
    }
  };

  // Calculate cash: starting balance + payments received - expenses
  const totalPaymentsReceived = orders.reduce((sum, order) => sum + order.amountPaid, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const cashBalance = startingBalance + totalPaymentsReceived - totalExpenses;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-lg shadow-lg text-white">
        <div className="animate-pulse">
          <div className="h-4 bg-green-300 rounded w-24 mb-2"></div>
          <div className="h-8 bg-green-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-lg shadow-lg text-white">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-sm font-medium text-green-100">
          💵 Cash Balance
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs text-green-100 hover:text-white underline"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>
      
      <p className="text-3xl font-bold mb-3">
        ₱{cashBalance.toFixed(2)}
      </p>
      
      {isEditing && (
        <div className="mb-3 p-3 bg-white/20 rounded">
          <label className="text-xs text-green-100 block mb-1">
            Starting Cash Balance:
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 px-2 py-1 rounded text-gray-900 text-sm"
              placeholder="0.00"
            />
            <button
              onClick={handleSaveStartingBalance}
              className="px-3 py-1 bg-white text-green-600 rounded text-sm font-medium hover:bg-green-50"
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-1 text-sm text-green-100">
        <div className="flex justify-between">
          <span>Starting Balance:</span>
          <span className="font-semibold">₱{startingBalance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Payments Received:</span>
          <span className="font-semibold">+₱{totalPaymentsReceived.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Expenses:</span>
          <span className="font-semibold">-₱{totalExpenses.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
