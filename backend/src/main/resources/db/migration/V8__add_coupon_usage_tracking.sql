-- V8: Add coupon usage tracking and order-coupon relationship

-- Add coupon_id to orders table for tracking which coupon was used
ALTER TABLE orders
    ADD COLUMN coupon_id INT AFTER notes,
    ADD COLUMN coupon_code VARCHAR(50) AFTER coupon_id,
    ADD CONSTRAINT fk_orders_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;

-- Create coupon_usage table for tracking coupon usage per user
CREATE TABLE IF NOT EXISTS coupon_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    discount_applied DECIMAL(15,2) NOT NULL,
    used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_coupon_user (coupon_id, user_id),
    INDEX idx_coupon (coupon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add usage_count and max_usage_per_user to coupons for better control
ALTER TABLE coupons
    ADD COLUMN usage_count INT DEFAULT 0 AFTER max_usage_value,
    ADD COLUMN max_usage_per_user INT DEFAULT 1 AFTER usage_count,
    ADD COLUMN max_discount_amount DECIMAL(15,2) AFTER max_usage_per_user;
