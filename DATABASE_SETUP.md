# Database Setup Instructions

This application uses **Neon Postgres** (Vercel's recommended Postgres solution) for data persistence.

## Why Database?

The app now uses a real database instead of in-memory storage. This means:
- ✅ Data persists across deployments
- ✅ No data loss on server restart
- ✅ Proper relationships between tables
- ✅ Better performance and scalability

## Setting Up Database on Vercel

### Step 1: Create a Neon Postgres Database

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project: `order-monitoring-and-inventory`
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres (Powered by Neon)**
6. Choose a name (e.g., "order-monitoring-db")
7. Select your region (choose closest to your users)
8. Click **Create**

### Step 2: Vercel Will Automatically:

- Create the database
- Add the `DATABASE_URL` environment variable to your project
- Redeploy your app with the new environment variable

### Step 3: Initialize the Database

The database tables will be created automatically on the first API request. The app includes:
- Auto-initialization on first use
- Sample data seeding
- Proper schema with indexes

Alternatively, you can manually initialize by calling:
```bash
curl -X POST https://your-app.vercel.app/api/init-db \
  -H "Content-Type: application/json" \
  -d '{"seed": true}'
```

## Local Development Setup

### Option 1: Use Neon (Recommended)

1. Create a free Neon database at https://neon.tech
2. Copy the connection string
3. Create `.env.local` file:
```env
DATABASE_URL=your_neon_connection_string
```

### Option 2: Use Local Postgres

1. Install PostgreSQL locally
2. Create a database:
```sql
CREATE DATABASE order_monitoring;
```
3. Create `.env.local` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/order_monitoring
```

### Run the App

```bash
npm run dev
```

The database will initialize automatically on first API call.

## Database Schema

### Tables Created:

- **orders** - Customer orders with color variants support
- **payments** - Payment records linked to orders
- **filaments** - Filament inventory
- **invoices** - Invoice headers
- **invoice_items** - Invoice line items
- **expenses** - Business expenses tracking

### Relationships:

- Orders ← Payments (one-to-many)
- Invoices ← Invoice Items (one-to-many)

## Environment Variables

Required environment variable:
- `DATABASE_URL` - PostgreSQL connection string

This is automatically set by Vercel when you create a database through their dashboard.

## Troubleshooting

### "DATABASE_URL environment variable is not set"
- Make sure you've created a database in Vercel
- Check that the environment variable is set in your project settings
- Redeploy your app after adding the database

### Tables not created
- The tables are created automatically on first request
- Check the deployment logs in Vercel for any errors
- Try calling the init endpoint manually

### Data not persisting
- Verify `DATABASE_URL` is set correctly
- Check Vercel deployment logs for database connection errors
- Ensure your Neon database is active (free tier may sleep after inactivity)

## Migration from In-Memory Storage

The app previously used in-memory storage. Now with the database:
- All new data is stored in Postgres
- Data persists across deployments
- Better support for production use

## Cost

- **Neon Free Tier**: 500MB storage, 10 projects, no credit card required
- **Vercel**: No additional cost for using Neon Postgres
- Perfect for small to medium businesses

## Support

For issues with:
- **Neon Database**: https://neon.tech/docs
- **Vercel Integration**: https://vercel.com/docs/storage/vercel-postgres
