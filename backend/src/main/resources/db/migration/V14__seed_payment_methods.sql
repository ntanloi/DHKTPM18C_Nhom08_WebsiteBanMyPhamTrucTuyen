-- Add new columns to payment_method table
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'beautyboxdb' AND TABLE_NAME = 'payment_method' AND COLUMN_NAME = 'description';
SET @query = IF(@col_exists = 0, 'ALTER TABLE payment_method ADD COLUMN description VARCHAR(500) NULL AFTER code', 'SELECT "Column description already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'beautyboxdb' AND TABLE_NAME = 'payment_method' AND COLUMN_NAME = 'icon';
SET @query = IF(@col_exists = 0, 'ALTER TABLE payment_method ADD COLUMN icon VARCHAR(255) NULL AFTER description', 'SELECT "Column icon already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'beautyboxdb' AND TABLE_NAME = 'payment_method' AND COLUMN_NAME = 'is_recommended';
SET @query = IF(@col_exists = 0, 'ALTER TABLE payment_method ADD COLUMN is_recommended BOOLEAN DEFAULT FALSE AFTER is_active', 'SELECT "Column is_recommended already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'beautyboxdb' AND TABLE_NAME = 'payment_method' AND COLUMN_NAME = 'sort_order';
SET @query = IF(@col_exists = 0, 'ALTER TABLE payment_method ADD COLUMN sort_order INT DEFAULT 0 AFTER is_recommended', 'SELECT "Column sort_order already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Seed payment methods data
INSERT INTO payment_method (name, code, description, icon, is_active, is_recommended, sort_order, created_at, updated_at) VALUES
('Thanh toán khi nhận hàng', 'COD', 'Thanh toán bằng tiền mặt khi nhận hàng tại địa chỉ giao hàng', 'cash', TRUE, FALSE, 1, NOW(), NOW()),
('Thanh toán qua VNPay', 'VNPAY', 'Thanh toán online an toàn qua cổng thanh toán VNPay. Hỗ trợ thẻ ATM, Visa, Master, JCB, QR Code', 'vnpay', TRUE, TRUE, 2, NOW(), NOW()),
('Thanh toán qua ZaloPay', 'ZALOPAY', 'Thanh toán qua ví điện tử ZaloPay hoặc quét mã QR', 'zalopay', FALSE, FALSE, 3, NOW(), NOW()),
('Chuyển khoản ngân hàng', 'BANK_TRANSFER', 'Chuyển khoản trực tiếp đến tài khoản ngân hàng của cửa hàng', 'bank', TRUE, FALSE, 4, NOW(), NOW()),
('Thanh toán qua MoMo', 'MOMO', 'Thanh toán qua ví điện tử MoMo', 'momo', FALSE, FALSE, 5, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    description = VALUES(description),
    icon = VALUES(icon),
    is_active = VALUES(is_active),
    is_recommended = VALUES(is_recommended),
    sort_order = VALUES(sort_order),
    updated_at = NOW();
