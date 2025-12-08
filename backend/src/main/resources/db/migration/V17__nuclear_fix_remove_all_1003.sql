-- V17: Remove ALL data related to problematic OrderItem id=1003
-- This is nuclear option but necessary to fix Hibernate cache

USE beautyboxdb;

-- Step 1: Find all orders that have order_item id=1003
SELECT 'Orders with problematic order_item:' as status;
SELECT DISTINCT order_id 
FROM order_items 
WHERE id = 1003;

-- Step 2: Delete recipient_information for those orders
DELETE FROM recipient_information
WHERE order_id IN (SELECT DISTINCT order_id FROM order_items WHERE id = 1003);

-- Step 3: Delete payments for those orders
DELETE FROM payment
WHERE order_id IN (SELECT DISTINCT order_id FROM order_items WHERE id = 1003);

-- Step 4: Delete shipments for those orders  
DELETE FROM shipments
WHERE order_id IN (SELECT DISTINCT order_id FROM order_items WHERE id = 1003);

-- Step 5: Delete order_status_history for those orders
DELETE FROM order_status_history
WHERE order_id IN (SELECT DISTINCT order_id FROM order_items WHERE id = 1003);

-- Step 6: Delete ALL order_items with id=1003 (any remaining)
DELETE FROM order_items WHERE id = 1003;

-- Step 7: Delete the orders themselves
DELETE FROM orders
WHERE id IN (SELECT DISTINCT order_id FROM (SELECT order_id FROM order_items WHERE id = 1003) AS temp);

-- Step 8: Verify cleanup
SELECT 'Verification - Should be 0:' as status;
SELECT COUNT(*) as remaining_1003_rows FROM order_items WHERE id = 1003;

SELECT 'All duplicates check:' as status;
SELECT id, COUNT(*) as count
FROM order_items
GROUP BY id
HAVING COUNT(*) > 1;
