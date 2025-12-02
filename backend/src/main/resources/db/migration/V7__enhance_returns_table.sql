-- V7: Enhance returns table for complete return/refund workflow

-- Add new columns to returns table
ALTER TABLE returns 
    ADD COLUMN status VARCHAR(50) DEFAULT 'PENDING' AFTER reason,
    ADD COLUMN return_type VARCHAR(50) DEFAULT 'REFUND' AFTER status,
    ADD COLUMN refund_amount DECIMAL(15,2) AFTER return_type,
    ADD COLUMN refund_method VARCHAR(50) AFTER refund_amount,
    ADD COLUMN bank_account_number VARCHAR(50) AFTER refund_method,
    ADD COLUMN bank_name VARCHAR(100) AFTER bank_account_number,
    ADD COLUMN account_holder_name VARCHAR(255) AFTER bank_name,
    ADD COLUMN admin_notes TEXT AFTER account_holder_name,
    ADD COLUMN processed_by INT AFTER admin_notes,
    ADD COLUMN processed_at DATETIME AFTER processed_by,
    ADD COLUMN completed_at DATETIME AFTER processed_at;

-- Add foreign key for processed_by
ALTER TABLE returns
    ADD CONSTRAINT fk_returns_processed_by FOREIGN KEY (processed_by) REFERENCES users(id);

-- Add index for status
CREATE INDEX idx_returns_status ON returns(status);

-- Create return_items table for tracking which items are being returned
CREATE TABLE IF NOT EXISTS return_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    return_id INT NOT NULL,
    order_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    reason VARCHAR(500),
    condition_status VARCHAR(50) DEFAULT 'UNOPENED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
    INDEX idx_return_id (return_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create return_images table for evidence photos
CREATE TABLE IF NOT EXISTS return_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    return_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
    INDEX idx_return_id (return_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
