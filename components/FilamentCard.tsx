"use client";

import { Filament } from "@/types";
import { useState } from "react";

interface FilamentCardProps {
  filament: Filament;
  onUpdateWeight: (id: string, weight: number) => void;
}

export default function FilamentCard({
  filament,
  onUpdateWeight,
}: FilamentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newWeight, setNewWeight] = useState(filament.weight);

  const isLowStock = filament.weight < filament.lowStockThreshold;
  const stockPercentage = (filament.weight / 1000) * 100; // Assuming 1kg rolls

  const handleSave = () => {
    onUpdateWeight(filament.id, newWeight);
    setIsEditing(false);
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
        isLowStock ? "border-red-500" : "border-green-500"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {filament.type} - {filament.color}
          </h3>
          <p className="text-gray-600">{filament.brand}</p>
        </div>
        {isLowStock && (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
            Low Stock
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-medium">Weight:</span>
            {isEditing ? (
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(parseFloat(e.target.value))}
                className="w-24 px-2 py-1 border rounded text-right"
                min="0"
              />
            ) : (
              <span>{filament.weight}g</span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                isLowStock ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
        </div>
        <p>
          <span className="font-medium">Cost per kg:</span> ₱
          {filament.costPerKg.toFixed(2)}
        </p>
        <p>
          <span className="font-medium">Supplier:</span> {filament.supplier}
        </p>
        <p>
          <span className="font-medium">Low Stock Alert:</span>{" "}
          {filament.lowStockThreshold}g
        </p>
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setNewWeight(filament.weight);
              }}
              className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
          >
            Update Weight
          </button>
        )}
      </div>
    </div>
  );
}
