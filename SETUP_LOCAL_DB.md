# Local PostgreSQL Setup Instructions

## 1. Install PostgreSQL

Download from: https://www.postgresql.org/download/windows/

**During installation:**
- Set a password for the `postgres` user (remember this!)
- Port: 5432 (default)
- Accept other defaults

## 2. Create the database

Open PowerShell or Command Prompt and run:

```bash
# This will prompt for your postgres password
psql -U postgres

# In the PostgreSQL prompt, run:
CREATE DATABASE order_monitoring;
\q
```

## 3. Update .env.local

Edit `.env.local` and replace `yourpassword` with your actual postgres password:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/order_monitoring"
```

## 4. Run Prisma migrations

```bash
cd C:/dev/order-monitoring-and-inventory
npx prisma generate
npx prisma db push
```

## 5. Start the dev server

```bash
npm run dev
```

Your app should now connect to the local PostgreSQL database!

## Benefits of Local Database

✅ **Much faster** - No network latency  
✅ **More reliable** - No connection timeouts  
✅ **Works offline** - No internet required  
✅ **Same as production** - PostgreSQL compatible with Neon

## Switching back to Neon (Production)

Just swap the DATABASE_URL in `.env.local` back to the Neon connection string.
