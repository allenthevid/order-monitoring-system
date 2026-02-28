# 3D Print Order Monitoring and Inventory System

A comprehensive Next.js application for managing 3D printing orders, filament inventory, generating invoices, tracking payments, and managing expenses for your 3D printing business. All amounts are displayed in Philippine Pesos (₱).

## Features

### 📦 Order Management
- Track all 3D printing orders with detailed information
- Monitor order status (Pending, Printing, Completed, Cancelled)
- **Payment tracking** - Record payments with multiple payment methods (Cash, Card, Bank Transfer, PayPal, etc.)
- **Payment status** - Track unpaid, partial, and fully paid orders
- **Revenue dashboard** - View total revenue, collected payments, and outstanding amounts
- Customer information and order history
- Filter orders by status
- Real-time status updates

### 🎨 Filament Inventory
- Track filament stock levels by type and color
- Low stock alerts and visual indicators
- Support for multiple filament types (PLA, ABS, PETG, TPU, Nylon)
- Cost tracking per kilogram
- Supplier management
- Easy weight updates

### 🧾 Invoice Generator
- Generate professional invoices from completed orders
- Automatic tax calculation
- Customizable due dates
- PDF export functionality
- Invoice status tracking (Paid, Unpaid, Overdue)
- Invoice numbering system

### 💰 Expense Management
- **Track all business expenses** by category
- Categories: Filament, Maintenance, Electricity, Parts, Shipping, Other
- Link expenses to specific orders (optional)
- View expenses by category with totals
- Monthly expense summaries
- Filter expenses by category
- Vendor tracking

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **PDF Generation:** jsPDF with autoTable
- **Date Handling:** date-fns
- **Icons:** Heroicons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
order-monitoring-and-inventory/
├── app/
│   ├── api/              # API routes
│   │   ├── orders/       # Order endpoints & payment tracking
│   │   ├── filaments/    # Filament endpoints
│   │   ├── invoices/     # Invoice endpoints
│   │   └── expenses/     # Expense endpoints
│   ├── orders/           # Orders page with payment tracking
│   ├── inventory/        # Inventory page
│   ├── invoices/         # Invoices page
│   ├── expenses/         # Expenses page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── Navigation.tsx
│   ├── OrderCard.tsx
│   ├── OrderForm.tsx
│   ├── PaymentModal.tsx
│   ├── FilamentCard.tsx
│   ├── FilamentForm.tsx
│   ├── ExpenseCard.tsx
│   ├── ExpenseForm.tsx
│   ├── InvoiceCard.tsx
│   └── InvoiceGenerator.tsx
├── types/                # TypeScript type definitions
│   ├── index.ts
│   └── jspdf.d.ts
└── package.json
```

## Usage

### Managing Orders

1. Navigate to the Orders page
2. View revenue dashboard showing total revenue, collected payments, and outstanding amounts
3. Click "New Order" to create a new 3D printing order
4. Fill in customer details, item information, and pricing
5. Track order progress through different statuses
6. **Record payments**: Click "+ Record Payment" on any order card to add a payment
   - Enter payment amount, method (Cash, Card, Bank Transfer, PayPal, Other)
   - Add payment date and optional notes
   - View payment history in the order card
7. Update status as the print progresses

### Managing Inventory

1. Navigate to the Inventory page
2. View all filaments with stock levels and low stock warnings
3. Click "Add Filament" to add new filament to inventory
4. Update weight as you use filament
5. Monitor stock levels with visual indicators

### Generating Invoices

1. Navigate to the Invoices page
2. Click "Generate Invoice"
3. Select a completed order
4. Set tax rate and due date
5. Add optional notes
6. Generate and download PDF invoice

### Managing Expenses

1. Navigate to the Expenses page
2. View expense summaries: Total expenses, monthly expenses, and expense count
3. See expenses broken down by category
4. Click "Add Expense" to record a new expense
5. Select category (Filament, Maintenance, Electricity, Parts, Shipping, Other)
6. Enter amount, date, vendor, and optional notes
7. Optionally link expense to a specific order
8. Filter expenses by category
9. Delete expenses as needed

## Data Storage

Currently, the application uses in-memory storage for demonstration purposes. For production use, you should:

1. Integrate a database (PostgreSQL, MongoDB, etc.)
2. Add authentication and user management
3. Implement data persistence
4. Add backup and recovery mechanisms

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Multi-user support
- [ ] Email notifications for invoices
- [ ] Advanced reporting and analytics
- [ ] Print queue management
- [ ] Material cost calculator
- [ ] Customer portal
- [ ] Payment integration

## Contributing

This is a custom business application. For feature requests or bug reports, please contact the development team.

## License

Private - All rights reserved
