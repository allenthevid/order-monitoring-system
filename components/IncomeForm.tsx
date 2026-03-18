"use client";

import { useState, useEffect } from "react";
import { Income } from "@/types";

interface IncomeFormProps {
  onSubmit: (income: Omit<Income, "id"> | Income) => void;
  onCancel?: () => void;
  income?: Income;
  orders?: Array<{ id: string; itemName: string; customerName: string }>;
}

export default function IncomeForm({ onSubmit, onCancel, income, orders = [] }: IncomeFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    category: "other" as Income["category"],
    amount: "" as string | number,
    date: new Date().toISOString().split("T")[0],
    customerName: "",
    notes: "",
    relatedOrderId: "",
  });

  useEffect(() => {
    if (income) {
      setFormData({
        description: income.description,
        category: income.category,
        amount: income.amount || 0,
        date: (() => {
          try {
            const date = new Date(income.date);
            return isNaN(date.getTime()) ? new Date().toISOString().split("T")[0] : date.toISOString().split("T")[0];
          } catch {
            return new Date().toISOString().split("T")[0];
          }
        })(),
        customerName: income.customerName || "",
        notes: income.notes || "",
        relatedOrderId: income.relatedOrderId || "",
      });
    }
  }, [income]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeData = {
      ...formData,
      amount: typeof formData.amount === "string" ? parseFloat(formData.amount) || 0 : formData.amount,
      date: new Date(formData.date),
      customerName: formData.customerName || undefined,
      notes: formData.notes || undefined,
      relatedOrderId: formData.relatedOrderId || undefined,
    };
    
    if (income) {
      onSubmit({ ...incomeData, id: income.id });
    } else {
      onSubmit(incomeData);
      setFormData({
        description: "",
        category: "other",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        customerName: "",
        notes: "",
        relatedOrderId: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{income ? "Edit Income" : "Add Income"}</h2>
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
            placeholder="e.g., Custom design for client"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                category: e.target.value as Income["category"],
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="design_fee">Design Fee</option>
            <option value="sample_fee">Sample Fee</option>
            <option value="consultation">Consultation</option>
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
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            placeholder="e.g., John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          {income ? "Update Income" : "Add Income"}
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
