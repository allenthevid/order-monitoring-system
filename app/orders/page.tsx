"use client";

import { useState, useEffect } from "react";
import { Order, Payment } from "@/types";
import OrderRow from "@/components/OrderRow";
import OrderForm from "@/components/OrderForm";
import OrderEditForm from "@/components/OrderEditForm";
import CashSummary from "@/components/CashSummary";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch("/api/orders");
        const data = await response.json();
        
        if (!isMounted) return;
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error('Orders API did not return an array:', data);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (isMounted) {
          setOrders([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Orders API did not return an array:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
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

  const handleDeleteOrder = async (id: string) => {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/orders/${id}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error('Delete failed:', error);
          alert('Failed to delete order: ' + (error.error || 'Unknown error'));
          return;
        }
        
        // Optimistically remove from state
        setOrders(orders.filter(order => order.id !== id));
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order. Please try again.');
      }
    }
  };

  const handleAddPayment = async (orderId: string, payment: Payment) => {
    await fetch(`/api/orders/${orderId}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });
    fetchOrders();
  };

  const handleEditOrder = async (order: Order) => {
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      
      if (response.ok) {
        await fetchOrders();
        setEditingOrder(null);
      } else {
        const error = await response.json();
        alert('Failed to update order: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order. Please try again.');
    }
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
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      ) : (
        <>
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
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <CashSummary />
        
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

      {editingOrder && (
        <OrderEditForm
          order={editingOrder}
          onSubmit={handleEditOrder}
          onCancel={() => setEditingOrder(null)}
        />
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No orders found. Create your first order!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filament
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onStatusChange={handleUpdateStatus}
                    onAddPayment={handleAddPayment}
                    onDelete={handleDeleteOrder}
                    onEdit={setEditingOrder}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
