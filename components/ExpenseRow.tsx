"use client";

import { Expense } from "@/types";
import { format } from "date-fns";

interface ExpenseRowProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export default function ExpenseRow({ expense, onEdit, onDelete }: ExpenseRowProps) {
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
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-xl">{categoryIcons[expense.category]}</span>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-gray-900">{expense.description}</div>
        {expense.notes && (
          <div className="text-xs text-gray-500 mt-1">{expense.notes}</div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${categoryColors[expense.category]}`}>
          {expense.category}
        </span>
      </td>
      <td className="px-4 py-3">
        {expense.vendor && (
          <div className="text-sm text-gray-900">{expense.vendor}</div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-red-600">
        -₱{expense.amount.toFixed(2)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(expense.date), "MMM dd, yyyy")}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(expense)}
              className="text-blue-600 hover:text-blue-900"
              title="Edit"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(expense.id)}
              className="text-red-600 hover:text-red-900"
              title="Delete"
            >
              🗑️
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
