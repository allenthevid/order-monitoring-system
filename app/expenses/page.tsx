"use client";

import { useState, useEffect } from "react";
import { Expense, Order } from "@/types";
import ExpenseCard from "@/components/ExpenseCard";
import ExpenseForm from "@/components/ExpenseForm";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    fetchExpenses();
    fetchOrders();
  }, []);

  const fetchExpenses = async () => {
    const response = await fetch("/api/expenses");
    const data = await response.json();
    setExpenses(data);
  };

  const fetchOrders = async () => {
    const response = await fetch("/api/orders");
    const data = await response.json();
    setOrders(data);
  };

  const handleAddExpense = async (expense: Omit<Expense, "id">) => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
    const newExpense = await response.json();
    setExpenses([...expenses, newExpense]);
    setShowForm(false);
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    
    await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    });
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const filteredExpenses = expenses.filter(
    (expense) => filterCategory === "all" || expense.category === filterCategory
  );

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return (
      expenseDate >= startOfMonth(now) && expenseDate <= endOfMonth(now)
    );
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyExpenses = currentMonthExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track all business expenses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          {showForm ? "Cancel" : "Add Expense"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold text-red-600">
            ₱{totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            This Month
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            ₱{monthlyExpenses.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {format(new Date(), "MMMM yyyy")}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total Items
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {expenses.length}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(categoryTotals).map(([category, total]) => (
            <div key={category} className="flex justify-between items-center">
              <span className="text-sm capitalize text-gray-700">
                {category}:
              </span>
              <span className="font-semibold text-gray-900">
                ₱{total.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <ExpenseForm
            onSubmit={handleAddExpense}
            orders={orders.map((o) => ({
              id: o.id,
              itemName: o.itemName,
              customerName: o.customerName,
            }))}
          />
        </div>
      )}

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "filament", "maintenance", "electricity", "parts", "shipping", "other"].map(
          (category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-md capitalize ${
                filterCategory === category
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          )
        )}
      </div>

      {/* Expense Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onDelete={handleDeleteExpense}
          />
        ))}
      </div>

      {filteredExpenses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No expenses found. Add your first expense!
        </div>
      )}
    </div>
  );
}
