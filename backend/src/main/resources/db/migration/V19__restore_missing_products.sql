-- V19: Restore missing products - ensure all seeded products exist
-- Products 101-115 should exist from V11 but may be missing due to database resets

-- Check if products already exist, if not, reinsert them
INSERT INTO products (id, name, slug, description, category_id, brand_id, status, created_at, updated_at)
SELECT * FROM (
    SELECT 
        101 as id,
        'Kem Dưỡng Da Chuyên Sâu Aestura Atobarrier365 Cream 80ml' as name,
        'kem-duong-da-chuyen-sau-aestura-atobarrier-365-cream-80ml' as slug,
        'Công dụng chính: Bổ sung độ ẩm chuyển sâu lên đến 100 giờ giúp làn da luôn căng mọng, giảm thiểu sự bong tróc, khô sần mang lại làn da ẩm mượt tràn đầy sức sống.\nThành phần chính: Niacinamide, chiết xuất trà xanh.\nLoại da phù hợp: Mọi loại da, đặc biệt là da khô sần, thiếu nước.' as description,
        5 as category_id,
        2 as brand_id,
        'active' as status,
        NOW() as created_at,
        NOW() as updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE id = 101
) LIMIT 1;

INSERT INTO products (id, name, slug, description, category_id, brand_id, status, created_at, updated_at)
SELECT * FROM (
    SELECT 
        102 as id,
        'Sữa Dưỡng Da Aestura Atobarrier365 Lotion 150ml' as name,
        'sua-duong-da-mem-mai-aestura-atobarrier-365-lotion-150ml' as slug,
        'Công dụng chính: Cấp ẩm, dưỡng sáng và tăng cường sức đề kháng giúp làn da khỏe mạnh, tránh khỏi nứt nẻ, khô sần.\nThành phần chính: Niacinamide, chiết xuất trà xanh.\nLoại da phù hợp: Mọi loại da, kể cả làn da nhạy cảm.' as description,
        5 as category_id,
        2 as brand_id,
        'active' as status,
        NOW() as created_at,
        NOW() as updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE id = 102
) LIMIT 1;

INSERT INTO products (id, name, slug, description, category_id, brand_id, status, created_at, updated_at)
SELECT * FROM (
    SELECT 
        103 as id,
        'Nước Cân Bằng Cấp Ẩm Aestura Theracne 365 Hydration Toner 150ml' as name,
        'nuoc-can-bang-cap-am-aestura-theracne-365-hydration-toner-150ml' as slug,
        'Công dụng chính: Cấp ẩm vượt trội, cân bằng lượng dầu và nước giúp da luôn căng bóng, mềm mại suốt nhiều giờ liền.\nThành phần chính: Chiết xuất trà xanh, Niacinamide.\nLoại da phù hợp: Mọi loại da, kể cả da nhạy cảm.' as description,
        3 as category_id,
        2 as brand_id,
        'active' as status,
        NOW() as created_at,
        NOW() as updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE id = 103
) LIMIT 1;

INSERT INTO products (id, name, slug, description, category_id, brand_id, status, created_at, updated_at)
SELECT * FROM (
    SELECT 
        109 as id,
        'Nước Xịt Khoáng Avene Làm Dịu & Giảm Kích Ứng Da Thermal Spring Water 50ml' as name,
        'nuoc-xit-khoang-avene-lam-diu-giam-kich-ung-da-thermal-spring-water-50ml' as slug,
        'Xịt Khoáng Avene Thermal Spring Water giúp làm dịu, giảm kích ứng da cho da nhạy cảm đồng thời cấp ẩm tức thời, mang lại cảm giác thoải mái, nhẹ nhàng cho làn da đang khát nước.\nThành phần chính: 100% Nước khoáng Eau Thermal Avene.' as description,
        1 as category_id,
        5 as brand_id,
        'active' as status,
        NOW() as created_at,
        NOW() as updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE id = 109
) LIMIT 1;

INSERT INTO products (id, name, slug, description, category_id, brand_id, status, created_at, updated_at)
SELECT * FROM (
    SELECT 
        113 as id,
        'Nước tẩy trang Bioderma Sensibio H2O Hồng Cho Da Nhạy Cảm 500Ml' as name,
        'dung-dich-lam-sach-va-tay-trang-cho-da-nhay-cam-bioderma-sensibio-h2o-500ml' as slug,
        'Công dụng chính: Làm sạch sâu loại bỏ bụi bẩn, lớp trang điểm giúp lỗ chân lông thông thoáng, hạn chế mụn viêm.\nLoại da phù hợp: Mọi loại da, đặc biệt là da nhạy cảm.\nThành phần chính: Chiết xuất từ thành phần thiên nhiên như lô hội, dưa chuột, trà xanh.' as description,
        3 as category_id,
        7 as brand_id,
        'active' as status,
        NOW() as created_at,
        NOW() as updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE id = 113
) LIMIT 1;

-- Ensure product variants exist for these products
INSERT INTO product_variants (id, product_id, name, sku, price, sale_price, stock_quantity, created_at, updated_at)
SELECT * FROM (
    SELECT 
        1001 as id, 101 as product_id, 'Kem Dưỡng Aestura 80ml' as name, 
        '11110732' as sku, 720000.00 as price, NULL as sale_price, 
        15 as stock_quantity, NOW() as created_at, NOW() as updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM product_variants WHERE id = 1001
) LIMIT 1;

INSERT INTO product_variants (id, product_id, name, sku, price, sale_price, stock_quantity, created_at, updated_at)
SELECT * FROM (
    SELECT 
        1002 as id, 102 as product_id, 'Sữa Dưỡng Aestura 150ml' as name,
        '11110730' as sku, 720000.00 as price, NULL as sale_price,
        12 as stock_quantity, NOW() as created_at, NOW() as updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM product_variants WHERE id = 1002
) LIMIT 1;

INSERT INTO product_variants (id, product_id, name, sku, price, sale_price, stock_quantity, created_at, updated_at)
SELECT * FROM (
    SELECT 
        1004 as id, 103 as product_id, 'Toner Aestura 150ml' as name,
        '11110728' as sku, 612000.00 as price, NULL as sale_price,
        20 as stock_quantity, NOW() as created_at, NOW() as updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM product_variants WHERE id = 1004
) LIMIT 1;

INSERT INTO product_variants (id, product_id, name, sku, price, sale_price, stock_quantity, created_at, updated_at)
SELECT * FROM (
    SELECT 
        1010 as id, 109 as product_id, 'Xịt Khoáng Avene 50ml' as name,
        '11110734' as sku, 220000.00 as price, NULL as sale_price,
        20 as stock_quantity, NOW() as created_at, NOW() as updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM product_variants WHERE id = 1010
) LIMIT 1;

INSERT INTO product_variants (id, product_id, name, sku, price, sale_price, stock_quantity, created_at, updated_at)
SELECT * FROM (
    SELECT 
        1014 as id, 113 as product_id, 'Tẩy Trang Bioderma Sensibio 500ml' as name,
        '11105724' as sku, 401250.00 as price, NULL as sale_price,
        25 as stock_quantity, NOW() as created_at, NOW() as updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM product_variants WHERE id = 1014
) LIMIT 1;
