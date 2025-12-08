-- V16: EMERGENCY FIX - Remove duplicate order_items id=1003
-- Must run this ASAP before restarting backend

USE beautyboxdb;

-- Step 1: Show duplicates before cleanup
SELECT 'BEFORE CLEANUP - Duplicates found:' as status;
SELECT id, order_id, product_variant_id, quantity, price
FROM order_items 
WHERE id = 1003
ORDER BY order_id;

-- Step 2: Keep only ONE row with id=1003 (the one with smallest order_id)
DELETE FROM order_items
WHERE id = 1003
AND order_id > (
    SELECT MIN(order_id) FROM (
        SELECT order_id FROM order_items WHERE id = 1003
    ) AS temp
);

-- Step 3: Verify only one row remains
SELECT 'AFTER CLEANUP - Should be only 1 row:' as status;
SELECT id, COUNT(*) as count_should_be_1
FROM order_items 
WHERE id = 1003
GROUP BY id;

-- Step 4: Check all other duplicates
SELECT 'Other duplicates (if any):' as status;
SELECT id, COUNT(*) as count
FROM order_items 
GROUP BY id 
HAVING COUNT(*) > 1;
