-- V4: Add paid_at column to payment table for VNPay integration

-- Check and add paid_at column if not exists
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'beautyboxdb' 
  AND TABLE_NAME = 'payment' 
  AND COLUMN_NAME = 'paid_at';

SET @query = IF(@col_exists = 0, 
    'ALTER TABLE payment ADD COLUMN paid_at DATETIME AFTER updated_at', 
    'SELECT "Column paid_at already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add index if not exists
SET @index_exists = 0;
SELECT COUNT(*) INTO @index_exists 
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'beautyboxdb' 
  AND TABLE_NAME = 'payment' 
  AND INDEX_NAME = 'idx_transaction_code';

SET @query = IF(@index_exists = 0, 
    'CREATE INDEX idx_transaction_code ON payment(transaction_code)', 
    'SELECT "Index idx_transaction_code already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
