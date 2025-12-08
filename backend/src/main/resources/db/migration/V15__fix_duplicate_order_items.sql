-- ============================================
-- V15: Fix ALL duplicate order_items permanently
-- Issue: Multiple rows with same ID causing Hibernate errors
-- ============================================

-- Step 1: Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Step 2: Backup original table
DROP TABLE IF EXISTS order_items_backup_v15;
CREATE TABLE order_items_backup_v15 AS SELECT * FROM order_items;

-- Step 3: Create clean table with same structure
DROP TABLE IF EXISTS order_items_clean;
CREATE TABLE order_items_clean LIKE order_items;

-- Step 4: Insert only unique rows (keep first occurrence per ID)
INSERT INTO order_items_clean
SELECT t1.*
FROM order_items t1
INNER JOIN (
    SELECT id, MIN(order_id) as min_order_id
    FROM order_items
    GROUP BY id
) t2 ON t1.id = t2.id AND t1.order_id = t2.min_order_id;

-- Step 5: Drop old table and rename clean table
DROP TABLE order_items;
RENAME TABLE order_items_clean TO order_items;

-- Step 6: Reset AUTO_INCREMENT to prevent future conflicts
SET @max_id = (SELECT IFNULL(MAX(id), 0) + 1 FROM order_items);
SET @alter_sql = CONCAT('ALTER TABLE order_items AUTO_INCREMENT=', @max_id);
PREPARE stmt FROM @alter_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 7: Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
