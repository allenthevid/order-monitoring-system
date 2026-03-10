"use client";

import { useState, useEffect } from "react";
import { Expense } from "@/types";

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, "id"> | Expense) => void;
  onCancel?: () => void;
  expense?: Expense;
  orders?: Array<{ id: string; itemName: string; customerName: string }>;
}

export default function ExpenseForm({ onSubmit, onCancel, expense, orders = [] }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    category: "other" as Expense["category"],
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    vendor: "",
    notes: "",
    relatedOrderId: "",
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description,
        category: expense.category,
        amount: expense.amount,
        date: new Date(expense.date).toISOString().split("T")[0],
        vendor: expense.vendor || "",
        notes: expense.notes || "",
        relatedOrderId: expense.relatedOrderId || "",
      });
    }
  }, [expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData = {
      ...formData,
      date: new Date(formData.date),
      vendor: formData.vendor || undefined,
      notes: formData.notes || undefined,
      relatedOrderId: formData.relatedOrderId || undefined,
    };
    
    if (expense) {
      onSubmit({ ...expenseData, id: expense.id });
    } else {
      onSubmit(expenseData);
      setFormData({
        description: "",
        category: "other",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        vendor: "",
        notes: "",
        relatedOrderId: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{expense ? "Edit Expense" : "Add Expense"}</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        )}
      </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          {expense ? "Update Expense" : "Add Expense"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
