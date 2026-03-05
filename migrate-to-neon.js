// Script to migrate data from local PostgreSQL to Neon
// Usage: node migrate-to-neon.js

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' }); // Load DB config

// Check for required environment variables
const localUrl = 'postgresql://postgres:Ys2b7123@localhost:5432/order_monitoring';
const neonUrl = process.env.DATABASE_URL_NEON;

console.log('Local DB:', localUrl.replace(/:[^:@]+@/, ':****@'));
console.log('Neon DB:', neonUrl ? neonUrl.replace(/:[^:@]+@/, ':****@') : 'NOT SET');

// Local database (source)
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: localUrl
    }
  }
});

// Neon database (destination)

if (!neonUrl || neonUrl.includes('localhost')) {
  console.error('❌ Error: NEON database URL not found or points to localhost');
  console.error('Please set DATABASE_URL_NEON in .env file with your Neon connection string');
  console.error('Example: DATABASE_URL_NEON="postgresql://user:pass@ep-xxx.region.neon.tech/neondb?sslmode=require"');
  process.exit(1);
}

const neonPrisma = new PrismaClient({
  datasources: {
    db: {
      url: neonUrl
    }
  }
});

async function migrateData() {
  try {
    console.log('🔄 Starting data migration from local to Neon...\n');

    // Fetch all data from local database
    console.log('📥 Reading data from local database...');
    const [orders, filaments, invoices, expenses, settings] = await Promise.all([
      localPrisma.order.findMany({ include: { payments: true } }),
      localPrisma.filament.findMany(),
      localPrisma.invoice.findMany(),
      localPrisma.expense.findMany(),
      localPrisma.setting.findMany()
    ]);

    console.log(`   Found: ${orders.length} orders, ${filaments.length} filaments, ${invoices.length} invoices, ${expenses.length} expenses, ${settings.length} settings\n`);

    // Clear Neon database (delete in correct order due to foreign keys)
    console.log('🗑️  Clearing Neon database...');
    await neonPrisma.payment.deleteMany();
    await neonPrisma.order.deleteMany();
    await neonPrisma.filament.deleteMany();
    await neonPrisma.invoice.deleteMany();
    await neonPrisma.expense.deleteMany();
    await neonPrisma.setting.deleteMany();
    console.log('   ✓ Cleared\n');

    // Insert data into Neon
    console.log('📤 Inserting data into Neon database...');

    // Insert Settings
    if (settings.length > 0) {
      for (const setting of settings) {
        await neonPrisma.setting.create({
          data: {
            id: setting.id,
            key: setting.key,
            value: setting.value,
            updatedAt: setting.updatedAt
          }
        });
      }
      console.log(`   ✓ Inserted ${settings.length} settings`);
    }

    // Insert Filaments
    if (filaments.length > 0) {
      for (const filament of filaments) {
        await neonPrisma.filament.create({
          data: {
            id: filament.id,
            name: filament.name,
            type: filament.type,
            color: filament.color,
            quantity: filament.quantity,
            costPerKg: filament.costPerKg,
            supplier: filament.supplier,
            dateAdded: filament.dateAdded
          }
        });
      }
      console.log(`   ✓ Inserted ${filaments.length} filaments`);
    }

    // Insert Orders with Payments
    if (orders.length > 0) {
      for (const order of orders) {
        const { payments, ...orderData } = order;
        
        await neonPrisma.order.create({
          data: {
            id: orderData.id,
            customerName: orderData.customerName,
            email: orderData.email,
            itemName: orderData.itemName,
            quantity: orderData.quantity,
            filamentType: orderData.filamentType,
            filamentColor: orderData.filamentColor,
            printTime: orderData.printTime,
            price: orderData.price,
            status: orderData.status,
            orderDate: orderData.orderDate,
            notes: orderData.notes,
            amountPaid: orderData.amountPaid,
            paymentStatus: orderData.paymentStatus,
            colorVariants: orderData.colorVariants,
            payments: {
              create: payments.map(payment => ({
                id: payment.id,
                amount: payment.amount,
                method: payment.method,
                date: payment.date,
                notes: payment.notes
              }))
            }
          }
        });
      }
      console.log(`   ✓ Inserted ${orders.length} orders with their payments`);
    }

    // Insert Invoices
    if (invoices.length > 0) {
      for (const invoice of invoices) {
        await neonPrisma.invoice.create({
          data: {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            orderId: invoice.orderId,
            customerName: invoice.customerName,
            totalAmount: invoice.totalAmount,
            issuedDate: invoice.issuedDate,
            dueDate: invoice.dueDate,
            pdfUrl: invoice.pdfUrl
          }
        });
      }
      console.log(`   ✓ Inserted ${invoices.length} invoices`);
    }

    // Insert Expenses
    if (expenses.length > 0) {
      for (const expense of expenses) {
        await neonPrisma.expense.create({
          data: {
            id: expense.id,
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            vendor: expense.vendor,
            notes: expense.notes
          }
        });
      }
      console.log(`   ✓ Inserted ${expenses.length} expenses`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   • ${orders.length} orders migrated`);
    console.log(`   • ${filaments.length} filaments migrated`);
    console.log(`   • ${invoices.length} invoices migrated`);
    console.log(`   • ${expenses.length} expenses migrated`);
    console.log(`   • ${settings.length} settings migrated`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await localPrisma.$disconnect();
    await neonPrisma.$disconnect();
  }
}

// Run migration
migrateData();
