"use client";

import { Invoice } from "@/types";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceCardProps {
  invoice: Invoice;
}

export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  const statusColors = {
    unpaid: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("INVOICE", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 40);
    doc.text(`Issue Date: ${format(invoice.issueDate, "MMM dd, yyyy")}`, 20, 46);
    doc.text(`Due Date: ${format(invoice.dueDate, "MMM dd, yyyy")}`, 20, 52);

    // Customer info
    doc.setFontSize(12);
    doc.text("Bill To:", 20, 65);
    doc.setFontSize(10);
    doc.text(invoice.customerName, 20, 71);
    doc.text(invoice.customerEmail, 20, 77);

    // Items table
    autoTable(doc, {
      startY: 90,
      head: [["Description", "Qty", "Unit Price", "Total"]],
      body: invoice.items.map((item) => [
        item.description,
        item.quantity.toString(),
        `₱${item.unitPrice.toFixed(2)}`,
        `₱${item.total.toFixed(2)}`,
      ]),
    });

    // Totals
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 90;
    doc.text(`Subtotal: ₱${invoice.subtotal.toFixed(2)}`, 150, finalY + 10);
    doc.text(`Tax: ₱${invoice.tax.toFixed(2)}`, 150, finalY + 16);
    doc.setFontSize(12);
    doc.text(`Total: ₱${invoice.total.toFixed(2)}`, 150, finalY + 24);

    if (invoice.notes) {
      doc.setFontSize(10);
      doc.text("Notes:", 20, finalY + 35);
      doc.text(invoice.notes, 20, finalY + 41);
    }

    doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Invoice #{invoice.invoiceNumber}
          </h3>
          <p className="text-gray-600">{invoice.customerName}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[invoice.status]
          }`}
        >
          {invoice.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p>
          <span className="font-medium">Issue Date:</span>{" "}
          {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
        </p>
        <p>
          <span className="font-medium">Due Date:</span>{" "}
          {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
        </p>
        <p>
          <span className="font-medium">Email:</span> {invoice.customerEmail}
        </p>
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="space-y-1 text-sm">
          {invoice.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.description} x{item.quantity}
              </span>
              <span>₱{item.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 space-y-1 text-sm mb-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₱{invoice.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>₱{invoice.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-base">
          <span>Total:</span>
          <span>₱{invoice.total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={downloadPDF}
        className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
      >
        Download PDF
      </button>
    </div>
  );
}
