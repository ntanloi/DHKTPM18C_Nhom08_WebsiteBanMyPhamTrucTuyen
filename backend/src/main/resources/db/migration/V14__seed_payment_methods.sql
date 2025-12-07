-- Add new columns to payment_method table
ALTER TABLE payment_method 
ADD COLUMN IF NOT EXISTS description VARCHAR(500) NULL AFTER code,
ADD COLUMN IF NOT EXISTS icon VARCHAR(255) NULL AFTER description,
ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT FALSE AFTER is_active,
ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0 AFTER is_recommended;

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
