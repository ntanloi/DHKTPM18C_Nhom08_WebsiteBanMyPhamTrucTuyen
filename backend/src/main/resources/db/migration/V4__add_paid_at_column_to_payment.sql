-- V4: Add paid_at column to payment table for VNPay integration

ALTER TABLE payment ADD COLUMN IF NOT EXISTS paid_at DATETIME AFTER updated_at;

-- Add index for transaction_code to improve lookup performance
CREATE INDEX IF NOT EXISTS idx_transaction_code ON payment(transaction_code);
