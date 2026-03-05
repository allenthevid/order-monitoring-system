// Order Types
export type OrderStatus = 'pending' | 'printing' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'paypal' | 'other';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface Payment {
  id?: number;
  amount: number;
  method: PaymentMethod;
  date: Date;
  notes?: string;
}

export interface ColorVariant {
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  itemName: string;
  quantity: number;
  filamentType: string;
  filamentColor: string;
  printTime: number; // in hours
  price: number;
  status: OrderStatus;
  orderDate: Date;
  completionDate?: Date;
  notes?: string;
  // Multiple colors for same item
  colorVariants?: ColorVariant[];
  // Payment tracking
  payments: Payment[];
  amountPaid: number;
  paymentStatus: PaymentStatus;
}

// Filament Inventory Types
export type FilamentType = 'PLA' | 'ABS' | 'PETG' | 'TPU' | 'Nylon';

export interface Filament {
  id: string;
  type: FilamentType;
  color: string;
  brand: string;
  weight: number; // in grams
  costPerKg: number;
  supplier: string;
  dateAdded: Date;
  lowStockThreshold: number;
}

// Invoice Types
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'unpaid' | 'paid' | 'overdue';
  notes?: string;
}

// Expense Types
export type ExpenseCategory = 'filament' | 'maintenance' | 'electricity' | 'parts' | 'shipping' | 'other';

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  date: Date;
  vendor?: string;
  notes?: string;
  relatedOrderId?: string;
}
