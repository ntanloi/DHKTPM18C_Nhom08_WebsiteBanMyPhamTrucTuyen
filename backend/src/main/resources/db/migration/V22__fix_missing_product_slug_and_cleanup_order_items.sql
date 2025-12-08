-- V22: Fix missing product slug/variant and cleanup duplicate order_items
-- 1) Ensure Beauty Box product "Sữa Dưỡng Da Aestura Atobarrier365 Lotion 150ml" exists with slug used by frontend
-- 2) Ensure its main variant id=1002 exists with stock
-- 3) Cleanup any duplicate order_items ids (e.g., 1002/1003) keeping the smallest order_id
-- 4) Reset AUTO_INCREMENT for order_items to prevent reuse of duplicate ids

-- 1) Upsert product with slug `sua-duong-da-mem-mai-aestura-atobarrier-365-lotion-150ml`
INSERT INTO products (id, name, slug, description, category_id, brand_id, status, created_at, updated_at)
SELECT * FROM (
    SELECT 
        102 AS id,
        'Sữa Dưỡng Da Aestura Atobarrier365 Lotion 150ml' AS name,
        'sua-duong-da-mem-mai-aestura-atobarrier-365-lotion-150ml' AS slug,
        'Công dụng chính: Cấp ẩm, dưỡng sáng và tăng cường sức đề kháng giúp làn da khỏe mạnh, tránh khỏi nứt nẻ, khô sần.
Thành phần chính: Niacinamide, chiết xuất trà xanh.
Loại da phù hợp: Mọi loại da, kể cả làn da nhạy cảm.' AS description,
        5 AS category_id,   -- Face/body lotion category (matches previous seeds)
        2 AS brand_id,      -- Aestura
        'active' AS status,
        NOW() AS created_at,
        NOW() AS updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE id = 102 OR slug = 'sua-duong-da-mem-mai-aestura-atobarrier-365-lotion-150ml'
) LIMIT 1;

-- 2) Upsert main product variant id=1002 for product 102
INSERT INTO product_variants (id, product_id, name, sku, price, sale_price, stock_quantity, created_at, updated_at)
SELECT * FROM (
    SELECT 
        1002 AS id,
        102 AS product_id,
        'Sữa Dưỡng Aestura 150ml' AS name,
        '11110730' AS sku,
        720000.00 AS price,
        NULL AS sale_price,
        20 AS stock_quantity,
        NOW() AS created_at,
        NOW() AS updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM product_variants WHERE id = 1002
) LIMIT 1;

-- 3) Remove duplicate order_items by primary key (keep smallest order_id for each duplicated id)
DELETE oi
FROM order_items oi
JOIN (
    SELECT oi1.id, oi1.order_id
    FROM order_items oi1
    JOIN (
        SELECT id, MIN(order_id) AS keep_order_id
        FROM order_items
        GROUP BY id
        HAVING COUNT(*) > 1
    ) dups ON oi1.id = dups.id
    WHERE oi1.order_id > dups.keep_order_id
) dup ON oi.id = dup.id AND oi.order_id = dup.order_id;

-- 4) Reset AUTO_INCREMENT for order_items to max(id)+1 to avoid collisions
SET @max_order_item_id = (SELECT COALESCE(MAX(id), 0) FROM order_items);
SET @sql_reset_ai = CONCAT('ALTER TABLE order_items AUTO_INCREMENT = ', @max_order_item_id + 1);
PREPARE stmt FROM @sql_reset_ai;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5) Safety check: report any remaining duplicates (should be zero)
SELECT id, COUNT(*) AS duplicate_count
FROM order_items
GROUP BY id
HAVING COUNT(*) > 1;

