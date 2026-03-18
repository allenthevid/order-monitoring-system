"use client";

import { Income } from "@/types";
import { format } from "date-fns";

interface IncomeRowProps {
  income: Income;
  onEdit?: (income: Income) => void;
  onDelete?: (id: string) => void;
}

export default function IncomeRow({ income, onEdit, onDelete }: IncomeRowProps) {
  const categoryColors = {
    design_fee: "bg-blue-100 text-blue-800",
    sample_fee: "bg-purple-100 text-purple-800",
    consultation: "bg-indigo-100 text-indigo-800",
    other: "bg-gray-100 text-gray-800",
  };

  const categoryIcons = {
    design_fee: "🎨",
    sample_fee: "🧪",
    consultation: "💡",
    other: "💵",
  };

  const categoryLabels = {
    design_fee: "Design Fee",
    sample_fee: "Sample Fee",
    consultation: "Consultation",
    other: "Other",
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-xl">{categoryIcons[income.category]}</span>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-gray-900">{income.description}</div>
        {income.notes && (
          <div className="text-xs text-gray-500 mt-1">{income.notes}</div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryColors[income.category]}`}>
          {categoryLabels[income.category]}
        </span>
      </td>
      <td className="px-4 py-3">
        {income.customerName && (
          <div className="text-sm text-gray-900">{income.customerName}</div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">
        +₱{(income.amount || 0).toFixed(2)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(income.date), "MMM dd, yyyy")}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(income)}
              className="text-blue-600 hover:text-blue-900"
              title="Edit"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(income.id)}
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
