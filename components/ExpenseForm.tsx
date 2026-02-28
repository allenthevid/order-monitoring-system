"use client";

import { useState } from "react";
import { Expense } from "@/types";

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, "id">) => void;
  orders?: Array<{ id: string; itemName: string; customerName: string }>;
}

export default function ExpenseForm({ onSubmit, orders = [] }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    category: "other" as Expense["category"],
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    vendor: "",
    notes: "",
    relatedOrderId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: new Date(formData.date),
      vendor: formData.vendor || undefined,
      notes: formData.notes || undefined,
      relatedOrderId: formData.relatedOrderId || undefined,
    });
    setFormData({
      description: "",
      category: "other",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      vendor: "",
      notes: "",
      relatedOrderId: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <input
            type="text"
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="e.g., PLA Filament purchase"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as Expense["category"],
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="filament">Filament</option>
            <option value="maintenance">Maintenance</option>
            <option value="electricity">Electricity</option>
            <option value="parts">Parts</option>
            <option value="shipping">Shipping</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₱) *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: parseFloat(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendor
          </label>
          <input
            type="text"
            value={formData.vendor}
            onChange={(e) =>
              setFormData({ ...formData, vendor: e.target.value })
            }
            placeholder="e.g., Amazon, Local Store"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {orders.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Order (Optional)
            </label>
            <select
              value={formData.relatedOrderId}
              onChange={(e) =>
                setFormData({ ...formData, relatedOrderId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">-- None --</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.itemName} - {order.customerName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={orders.length > 0 ? "md:col-span-2" : ""}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows={3}
            placeholder="Additional details..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
      >
        Add Expense
      </button>
    </form>
  );
}
