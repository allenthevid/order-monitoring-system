"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";

interface CustomerOrderFormData {
  customerName: string;
  email: string;
  productId: string;
  quantity: number;
  filamentColor: string;
  notes: string;
}

export default function CustomerOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filamentColors, setFilamentColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<CustomerOrderFormData>({
    customerName: "",
    email: "",
    productId: "",
    quantity: 1,
    filamentColor: "",
    notes: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch products
        const productsResponse = await fetch("/api/products");
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Fetch unique filament colors from filaments
        const filamentsResponse = await fetch("/api/filaments");
        const filamentsData = await filamentsResponse.json();
        const uniqueColors: string[] = [...new Set(filamentsData.map((filament: any) => filament.color))] as string[];
        setFilamentColors(uniqueColors.filter((color): color is string => !!color && color.trim() !== ""));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const selectedProduct = products.find(p => p.id === formData.productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const orderData = {
        customerName: formData.customerName,
        email: formData.email,
        itemName: selectedProduct.name,
        quantity: formData.quantity,
        filamentType: selectedProduct.filamentType,
        filamentColor: formData.filamentColor,
        printTime: 0, // Will be set by admin later
        price: selectedProduct.basePrice * formData.quantity,
        status: "pending" as const,
        orderDate: new Date(),
        notes: formData.notes,
        payments: [],
        amountPaid: 0,
        paymentStatus: "unpaid" as const,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          customerName: "",
          email: "",
          productId: "",
          quantity: 1,
          filamentColor: "",
          notes: "",
        });
      } else {
        alert("Failed to submit order. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Order Submitted!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We&apos;ll contact you soon with updates.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Place Your Order
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product *
              </label>
              <select
                required
                value={formData.productId}
                onChange={(e) =>
                  setFormData({ ...formData, productId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ₱{product.basePrice.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filament Color
                </label>
                <select
                  value={formData.filamentColor}
                  onChange={(e) =>
                    setFormData({ ...formData, filamentColor: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select color (optional)</option>
                  {filamentColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedProduct && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Product: {selectedProduct.name}</p>
                  <p>Filament Type: {selectedProduct.filamentType}</p>
                  <p>Unit Price: ₱{selectedProduct.basePrice.toFixed(2)}</p>
                  <p>Quantity: {formData.quantity}</p>
                  <p className="font-semibold text-gray-900">
                    Total: ₱{(selectedProduct.basePrice * formData.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any special instructions or notes..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || !selectedProduct}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Submitting..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}