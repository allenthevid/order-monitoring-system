-- Create income table for tracking non-order revenue
CREATE TABLE IF NOT EXISTS income (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  customer_name TEXT,
  notes TEXT,
  related_order_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_income_category ON income(category);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
