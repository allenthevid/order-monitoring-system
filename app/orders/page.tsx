"use client";

import { useState, useEffect } from "react";
import { Order, Payment } from "@/types";
import OrderCard from "@/components/OrderCard";
import OrderForm from "@/components/OrderForm";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch("/api/orders");
    const data = await response.json();
    setOrders(data);
  };

  const handleAddOrder = async (order: Omit<Order, "id">) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const newOrder = await response.json();
    setOrders([...orders, newOrder]);
    setShowForm(false);
  };

  const handleUpdateStatus = async (id: string, status: Order["status"]) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const handleAddPayment = async (orderId: string, payment: Payment) => {
    await fetch(`/api/orders/${orderId}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });
    fetchOrders();
  };

  const filteredOrders = orders.filter(
    (order) => filter === "all" || order.status === filter
  );

  // Calculate total revenue and payments
  const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
  const totalPaid = orders.reduce((sum, order) => sum + order.amountPaid, 0);
  const totalOutstanding = totalRevenue - totalPaid;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-600 mt-1">
            ₱{totalPaid.toFixed(2)} collected of ₱{totalRevenue.toFixed(2)} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "New Order"}
        </button>
      </div>

      {/* Revenue Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total Revenue
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            ₱{totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Collected
          </h3>
          <p className="text-2xl font-bold text-green-600">
            ₱{totalPaid.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Outstanding
          </h3>
          <p className="text-2xl font-bold text-red-600">
            ₱{totalOutstanding.toFixed(2)}
          </p>
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <OrderForm onSubmit={handleAddOrder} />
        </div>
      )}

      <div className="mb-6 flex gap-2">
        {["all", "pending", "printing", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md capitalize ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChange={handleUpdateStatus}
            onAddPayment={handleAddPayment}
          />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No orders found. Create your first order!
        </div>
      )}
    </div>
  );
}
