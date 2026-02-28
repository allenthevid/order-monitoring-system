"use client";

import { useState } from "react";
import { Order, Payment } from "@/types";
import { format } from "date-fns";
import PaymentModal from "./PaymentModal";

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, status: Order["status"]) => void;
  onAddPayment: (orderId: string, payment: Payment) => void;
}

export default function OrderCard({ order, onStatusChange, onAddPayment }: OrderCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    printing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const paymentStatusColors = {
    unpaid: "bg-red-100 text-red-800",
    partial: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
  };

  const amountRemaining = order.price - order.amountPaid;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {order.itemName}
            </h3>
            <p className="text-gray-600">{order.customerName}</p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[order.status]
              }`}
            >
              {order.status}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                paymentStatusColors[order.paymentStatus]
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>
            <span className="font-medium">Quantity:</span> {order.quantity}
          </p>
          <p>
            <span className="font-medium">Filament Type:</span> {order.filamentType}
          </p>
          {order.colorVariants && order.colorVariants.length > 0 ? (
            <div>
              <span className="font-medium">Colors:</span>
              <div className="ml-4 mt-1 space-y-1">
                {order.colorVariants.map((variant, idx) => (
                  <div key={idx} className="text-xs">
                    • {variant.color} - Qty: {variant.quantity}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>
              <span className="font-medium">Color:</span> {order.filamentColor}
            </p>
          )}
          <p>
            <span className="font-medium">Print Time:</span> {order.printTime}h
          </p>
          <p>
            <span className="font-medium">Price:</span> ₱{order.price.toFixed(2)}
          </p>
          <p>
            <span className="font-medium">Order Date:</span>{" "}
            {format(new Date(order.orderDate), "MMM dd, yyyy")}
          </p>
        </div>

        {/* Payment Information */}
        <div className="border-t pt-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Payment:</span>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="text-xs text-green-600 hover:text-green-700 font-medium"
              disabled={order.paymentStatus === "paid"}
            >
              {order.paymentStatus === "paid" ? "✓ Paid" : "+ Record Payment"}
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Paid:</span>
              <span className="font-semibold text-green-600">
                ₱{order.amountPaid.toFixed(2)}
              </span>
            </div>
            {amountRemaining > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-semibold text-red-600">
                  ₱{amountRemaining.toFixed(2)}
                </span>
              </div>
            )})
          </div>

          {order.payments && order.payments.length > 0 && (
            <details className="mt-2">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                View {order.payments.length} payment(s)
              </summary>
              <div className="mt-2 space-y-1">
                {order.payments.map((payment, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-gray-50 p-2 rounded flex justify-between"
                  >
                    <span>
                      ₱{payment.amount.toFixed(2)} - {payment.method}
                    </span>
                    <span className="text-gray-500">
                      {format(new Date(payment.date), "MMM dd")}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        {order.notes && (
          <p className="text-sm text-gray-500 mb-4 italic border-t pt-3">{order.notes}</p>
        )}

        <div className="flex gap-2">
          {order.status !== "completed" && order.status !== "cancelled" && (
            <>
              {order.status === "pending" && (
                <button
                  onClick={() => onStatusChange(order.id, "printing")}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Start Printing
                </button>
              )}
              {order.status === "printing" && (
                <button
                  onClick={() => onStatusChange(order.id, "completed")}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => onStatusChange(order.id, "cancelled")}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          orderId={order.id}
          orderTotal={order.price}
          amountRemaining={amountRemaining}
          onAddPayment={onAddPayment}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </>
  );
}
