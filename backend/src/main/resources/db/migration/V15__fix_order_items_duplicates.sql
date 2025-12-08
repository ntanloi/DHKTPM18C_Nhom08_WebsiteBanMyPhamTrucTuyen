-- V15: Fix duplicate order items and add proper constraints
-- This migration cleans up duplicate data and ensures proper constraints

-- Step 1: Create temporary table with deduplicated data
CREATE TEMPORARY TABLE order_items_clean AS
SELECT 
    MIN(id) as id,
    order_id,
    product_variant_id,
    MAX(quantity) as quantity,
    MAX(price) as price
FROM order_items
GROUP BY order_id, product_variant_id;

-- Step 2: Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Step 3: Clear order_items table
TRUNCATE TABLE order_items;

-- Step 4: Insert clean data back
INSERT INTO order_items (id, order_id, product_variant_id, quantity, price)
SELECT id, order_id, product_variant_id, quantity, price
FROM order_items_clean;

-- Step 5: Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Step 6: Drop temporary table
DROP TEMPORARY TABLE order_items_clean;

-- Step 7: Add unique constraint to prevent future duplicates
-- Each order should only have one item for each product variant
ALTER TABLE order_items
ADD UNIQUE KEY uk_order_product_variant (order_id, product_variant_id);

-- Step 8: Add index for better query performance
ALTER TABLE order_items
ADD INDEX idx_product_variant (product_variant_id);
