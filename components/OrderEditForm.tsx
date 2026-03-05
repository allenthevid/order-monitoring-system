"use client";

import { useState } from "react";
import { Order, ColorVariant } from "@/types";

interface OrderEditFormProps {
  order: Order;
  onSubmit: (order: Order) => void;
  onCancel: () => void;
}

export default function OrderEditForm({ order, onSubmit, onCancel }: OrderEditFormProps) {
  const [formData, setFormData] = useState({
    customerName: order.customerName,
    email: order.email,
    itemName: order.itemName,
    quantity: order.quantity,
    filamentType: order.filamentType,
    filamentColor: order.filamentColor,
    printTime: order.printTime,
    pricePerPc: order.price / order.quantity,
    notes: order.notes || "",
  });

  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(order.colorVariants || []);
  const [useMultipleColors, setUseMultipleColors] = useState(!!order.colorVariants && order.colorVariants.length > 0);
  const [newColor, setNewColor] = useState("");
  const [newColorQty, setNewColorQty] = useState(1);

  const handleAddColorVariant = () => {
    if (newColor.trim()) {
      setColorVariants([
        ...colorVariants,
        { color: newColor.trim(), quantity: newColorQty },
      ]);
      setNewColor("");
      setNewColorQty(1);
    }
  };

  const handleRemoveColorVariant = (index: number) => {
    setColorVariants(colorVariants.filter((_, i) => i !== index));
  };

  const getTotalQuantity = () => {
    return colorVariants.reduce((sum, variant) => sum + variant.quantity, 0);
  };

  const calculateTotalPrice = () => {
    const qty = useMultipleColors ? getTotalQuantity() : formData.quantity;
    return formData.pricePerPc * qty;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedOrder: Order = {
      ...order,
      ...formData,
      price: calculateTotalPrice(),
    };

    if (useMultipleColors && colorVariants.length > 0) {
      updatedOrder.colorVariants = colorVariants;
      updatedOrder.quantity = getTotalQuantity();
      updatedOrder.filamentColor = colorVariants.map(v => `${v.color} (${v.quantity})`).join(", ");
    } else {
      updatedOrder.colorVariants = undefined;
    }

    onSubmit(updatedOrder);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Edit Order</h2>
          
          <div className="grid md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.itemName}
                onChange={(e) =>
                  setFormData({ ...formData, itemName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                required={!useMultipleColors}
                min="1"
                value={useMultipleColors ? getTotalQuantity() : formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) })
                }
                disabled={useMultipleColors}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              {useMultipleColors && (
                <p className="text-xs text-gray-500 mt-1">
                  Total: {getTotalQuantity()} items
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filament Type *
              </label>
              <select
                value={formData.filamentType}
                onChange={(e) =>
                  setFormData({ ...formData, filamentType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PLA">PLA</option>
                <option value="ABS">ABS</option>
                <option value="PETG">PETG</option>
                <option value="TPU">TPU</option>
                <option value="Nylon">Nylon</option>
              </select>
            </div>

            {!useMultipleColors && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filament Color *
                </label>
                <input
                  type="text"
                  required={!useMultipleColors}
                  value={formData.filamentColor}
                  onChange={(e) =>
                    setFormData({ ...formData, filamentColor: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Multiple Colors Toggle */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMultipleColors}
                  onChange={(e) => {
                    setUseMultipleColors(e.target.checked);
                    if (!e.target.checked) {
                      setColorVariants([]);
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Order multiple colors of the same item
                </span>
              </label>
            </div>

            {/* Multiple Colors Section */}
            {useMultipleColors && (
              <div className="md:col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Color Variants
                </h3>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Color (e.g., Black)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={newColorQty}
                    onChange={(e) => setNewColorQty(parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddColorVariant}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>

                {colorVariants.length > 0 ? (
                  <div className="space-y-2">
                    {colorVariants.map((variant, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                      >
                        <span className="text-sm text-gray-700">
                          <span className="font-medium">{variant.color}</span> - Qty: {variant.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColorVariant(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No color variants added yet
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Print Time (hours)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.printTime}
                onChange={(e) =>
                  setFormData({ ...formData, printTime: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Piece (₱) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.pricePerPc}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerPc: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Price (₱)
              </label>
              <input
                type="text"
                value={`₱${calculateTotalPrice().toFixed(2)}`}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-gray-100 font-semibold"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.pricePerPc > 0 && (
                  <>₱{formData.pricePerPc.toFixed(2)} × {useMultipleColors ? getTotalQuantity() : formData.quantity} = ₱{calculateTotalPrice().toFixed(2)}</>
                )}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
