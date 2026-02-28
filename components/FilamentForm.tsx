"use client";

import { useState } from "react";
import { Filament } from "@/types";

interface FilamentFormProps {
  onSubmit: (filament: Omit<Filament, "id">) => void;
}

export default function FilamentForm({ onSubmit }: FilamentFormProps) {
  const [formData, setFormData] = useState({
    type: "PLA" as Filament["type"],
    color: "",
    brand: "",
    weight: 1000,
    costPerKg: 0,
    supplier: "",
    lowStockThreshold: 200,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dateAdded: new Date(),
    });
    setFormData({
      type: "PLA",
      color: "",
      brand: "",
      weight: 1000,
      costPerKg: 0,
      supplier: "",
      lowStockThreshold: 200,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Filament</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as Filament["type"] })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="PLA">PLA</option>
            <option value="ABS">ABS</option>
            <option value="PETG">PETG</option>
            <option value="TPU">TPU</option>
            <option value="Nylon">Nylon</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color *
          </label>
          <input
            type="text"
            required
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand *
          </label>
          <input
            type="text"
            required
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (grams) *
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost per kg (₱) *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.costPerKg}
            onChange={(e) =>
              setFormData({ ...formData, costPerKg: parseFloat(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier *
          </label>
          <input
            type="text"
            required
            value={formData.supplier}
            onChange={(e) =>
              setFormData({ ...formData, supplier: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Low Stock Threshold (grams) *
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.lowStockThreshold}
            onChange={(e) =>
              setFormData({
                ...formData,
                lowStockThreshold: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Add Filament
      </button>
    </form>
  );
}
