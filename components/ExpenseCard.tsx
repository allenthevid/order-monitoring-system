"use client";

import { Expense } from "@/types";
import { format } from "date-fns";

interface ExpenseCardProps {
  expense: Expense;
  onDelete?: (id: string) => void;
}

export default function ExpenseCard({ expense, onDelete }: ExpenseCardProps) {
  const categoryColors = {
    filament: "bg-purple-100 text-purple-800",
    maintenance: "bg-orange-100 text-orange-800",
    electricity: "bg-yellow-100 text-yellow-800",
    parts: "bg-blue-100 text-blue-800",
    shipping: "bg-green-100 text-green-800",
    other: "bg-gray-100 text-gray-800",
  };

  const categoryIcons = {
    filament: "🎨",
    maintenance: "🔧",
    electricity: "⚡",
    parts: "🔩",
    shipping: "📦",
    other: "💰",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryIcons[expense.category]}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {expense.description}
            </h3>
            {expense.vendor && (
              <p className="text-sm text-gray-600">{expense.vendor}</p>
            )}
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            categoryColors[expense.category]
          }`}
        >
          {expense.category}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Amount:</span>
          <span className="text-lg font-bold text-red-600">
            -₱{expense.amount.toFixed(2)}
          </span>
        </div>
        <p>
          <span className="font-medium">Date:</span>{" "}
          {format(new Date(expense.date), "MMM dd, yyyy")}
        </p>
        {expense.relatedOrderId && (
          <p className="text-xs text-gray-500">
            Related to Order: {expense.relatedOrderId}
          </p>
        )}
      </div>

      {expense.notes && (
        <p className="text-sm text-gray-500 mb-4 italic border-t pt-3">
          {expense.notes}
        </p>
      )}

      {onDelete && (
        <button
          onClick={() => onDelete(expense.id)}
          className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
        >
          Delete Expense
        </button>
      )}
    </div>
  );
}
