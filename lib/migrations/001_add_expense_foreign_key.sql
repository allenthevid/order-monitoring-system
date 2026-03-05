-- Migration: Add foreign key constraint to expenses table
-- This allows orders to be deleted even when they have related expenses
-- The related_order_id will be set to NULL when an order is deleted

-- First, add the vendor column if it doesn't exist (from previous updates)
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS vendor VARCHAR(255);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS related_order_id VARCHAR(255);

-- Drop the constraint if it exists (in case we're re-running this)
ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_related_order_id_fkey;

-- Add the foreign key constraint with ON DELETE SET NULL
ALTER TABLE expenses 
ADD CONSTRAINT expenses_related_order_id_fkey 
FOREIGN KEY (related_order_id) 
REFERENCES orders(id) 
ON DELETE SET NULL;
