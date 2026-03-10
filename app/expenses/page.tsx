"use client";

import { useState, useEffect } from "react";
import { Expense, Order } from "@/types";
import ExpenseRow from "@/components/ExpenseRow";
import ExpenseForm from "@/components/ExpenseForm";
import CashSummary from "@/components/CashSummary";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        
        const [expensesResponse, ordersResponse] = await Promise.all([
          fetch("/api/expenses"),
          fetch("/api/orders")
        ]);
        
        const expensesData = await expensesResponse.json();
        const ordersData = await ordersResponse.json();
        
        if (!isMounted) return;
        
        if (Array.isArray(expensesData)) {
          setExpenses(expensesData);
        } else {
          console.error('Expenses API did not return an array:', expensesData);
          setExpenses([]);
        }
        
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          setExpenses([]);
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

  const handleAddExpense = async (expense: Omit<Expense, "id"> | Expense) => {
    if ("id" in expense) {
      // Update existing expense
      const response = await fetch(`/api/expenses/${expense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });
      const updatedExpense = await response.json();
      setExpenses(expenses.map((e) => e.id === expense.id ? updatedExpense : e));
      setEditingExpense(null);
    } else {
      // Add new expense
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });
      const newExpense = await response.json();
      setExpenses([...expenses, newExpense]);
      setShowForm(false);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
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
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading expenses...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
              <p className="text-gray-600 mt-1">Track all business expenses</p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingExpense(null);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              {showForm ? "Cancel" : "Add Expense"}
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <CashSummary orders={orders} expenses={expenses} />
            
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
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Expenses by Category</h3>
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

          {editingExpense && (
            <div className="mb-6">
              <ExpenseForm
                expense={editingExpense}
                onSubmit={handleAddExpense}
                onCancel={() => setEditingExpense(null)}
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

          {/* Expense Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No expenses found. Add your first expense!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
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
                    {filteredExpenses.map((expense) => (
                      <ExpenseRow
                        key={expense.id}
                        expense={expense}
                        onEdit={handleEditExpense}
                        onDelete={handleDeleteExpense}
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
