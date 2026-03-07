"use client";

import { useState } from "react";
import { Order, Payment } from "@/types";
import { format } from "date-fns";
import PaymentModal from "./PaymentModal";

interface OrderRowProps {
  order: Order;
  onStatusChange: (id: string, status: Order["status"]) => void;
  onAddPayment: (orderId: string, payment: Payment) => void;
  onDelete: (id: string) => void;
  onEdit: (order: Order) => void;
}

export default function OrderRow({ order, onStatusChange, onAddPayment, onDelete, onEdit }: OrderRowProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
          {order.email && <div className="text-xs text-gray-500">{order.email}</div>}
        </td>
        <td className="px-4 py-3">
          <div className="text-sm text-gray-900">{order.itemName}</div>
          {order.notes && (
            <div className="text-xs text-gray-500 truncate max-w-xs">{order.notes}</div>
          )}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
          {order.quantity}
        </td>
        <td className="px-4 py-3">
          <div className="text-sm text-gray-900">{order.filamentType}</div>
          <div className="text-xs text-gray-500">{order.filamentColor}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">₱{order.price.toFixed(2)}</div>
          {order.printTime > 0 && (
            <div className="text-xs text-gray-500">{order.printTime}h</div>
          )}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col gap-1">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColors[order.paymentStatus]}`}>
              {order.paymentStatus}
            </span>
            <div className="text-xs text-gray-600">
              ₱{order.amountPaid.toFixed(2)} / ₱{order.price.toFixed(2)}
            </div>
            {order.paymentStatus !== "paid" && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                + Payment
              </button>
            )}
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
          {format(new Date(order.orderDate), "MMM dd, yyyy")}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end gap-1">
            {order.status !== "completed" && order.status !== "cancelled" && (
              <>
                <button
                  onClick={() => onEdit(order)}
                  className="text-gray-600 hover:text-gray-900 px-2 py-1"
                  title="Edit"
                >
                  ✏️
                </button>
                {order.status === "pending" && (
                  <button
                    onClick={() => onStatusChange(order.id, "printing")}
                    className="text-blue-600 hover:text-blue-900 px-2 py-1"
                    title="Start Printing"
                  >
                    ▶️
                  </button>
                )}
                {order.status === "printing" && (
                  <button
                    onClick={() => onStatusChange(order.id, "completed")}
                    className="text-green-600 hover:text-green-900 px-2 py-1"
                    title="Complete"
                  >
                    ✅
                  </button>
                )}
                <button
                  onClick={() => onStatusChange(order.id, "cancelled")}
                  className="text-red-600 hover:text-red-900 px-2 py-1"
                  title="Cancel"
                >
                  ❌
                </button>
              </>
            )}
            {(order.status === "completed" || order.status === "cancelled") && (
              <>
                <button
                  onClick={() => onStatusChange(order.id, "pending")}
                  className="text-yellow-600 hover:text-yellow-900 px-2 py-1"
                  title="Revert to Pending"
                >
                  ⏮️
                </button>
                <button
                  onClick={() => onStatusChange(order.id, "printing")}
                  className="text-blue-600 hover:text-blue-900 px-2 py-1"
                  title="Revert to Printing"
                >
                  ▶️
                </button>
                <button
                  onClick={() => onDelete(order.id)}
                  className="text-gray-600 hover:text-gray-900 px-2 py-1"
                  title="Delete"
                >
                  🗑️
                </button>
              </>
            )}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-gray-600 hover:text-gray-900 px-2 py-1"
              title="Details"
            >
              {showDetails ? "▲" : "▼"}
            </button>
          </div>
        </td>
      </tr>
      {showDetails && (
        <tr className="bg-gray-50">
          <td colSpan={9} className="px-4 py-3">
            <div className="text-sm space-y-2">
              {order.colorVariants && order.colorVariants.length > 0 && (
                <div>
                  <span className="font-medium">Color Variants:</span>
                  <div className="ml-4 mt-1 space-y-1">
                    {order.colorVariants.map((variant) => (
                      <div key={`${variant.color}-${variant.quantity}`} className="text-xs">
                        • {variant.color} - Qty: {variant.quantity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {order.payments && order.payments.length > 0 && (
                <div>
                  <span className="font-medium">Payment History ({order.payments.length}):</span>
                  <div className="ml-4 mt-1 space-y-1">
                    {order.payments.map((payment, idx) => (
                      <div key={payment.id || `payment-${idx}`} className="text-xs flex justify-between max-w-md">
                        <span>₱{payment.amount.toFixed(2)} - {payment.method}</span>
                        <span className="text-gray-500">{format(new Date(payment.date), "MMM dd, yyyy")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}

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
