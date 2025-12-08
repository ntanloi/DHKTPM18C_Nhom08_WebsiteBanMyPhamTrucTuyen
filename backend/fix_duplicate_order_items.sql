-- Fix duplicate OrderItem records for MySQL/MariaDB
-- This script removes duplicate order_items keeping only the first occurrence

-- Step 1: Check for duplicates
SELECT id, COUNT(*) as count
FROM order_items 
GROUP BY id 
HAVING COUNT(*) > 1;

-- Step 2: Create temporary table with IDs to keep
CREATE TEMPORARY TABLE order_items_to_keep AS
SELECT MIN(order_id) as order_id, id
FROM order_items
GROUP BY id;

-- Step 3: Delete duplicates (keep only rows in temp table)
DELETE o FROM order_items o
LEFT JOIN order_items_to_keep k ON o.id = k.id AND o.order_id = k.order_id
WHERE k.id IS NULL AND o.id IN (
    SELECT id FROM (
        SELECT id FROM order_items GROUP BY id HAVING COUNT(*) > 1
    ) AS duplicates
);

-- Step 4: Drop temporary table
DROP TEMPORARY TABLE IF EXISTS order_items_to_keep;

-- Step 5: Verify no more duplicates
SELECT id, COUNT(*) as count
FROM order_items 
GROUP BY id 
HAVING COUNT(*) > 1;

-- Step 6: Check current order_items structure
DESCRIBE order_items;

-- Step 7: If no duplicates, ensure proper constraints exist
-- ALTER TABLE order_items ADD CONSTRAINT uk_order_items_id UNIQUE (id);
