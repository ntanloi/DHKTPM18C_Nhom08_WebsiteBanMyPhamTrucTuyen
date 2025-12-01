-- Stock history tracking table for audit trail
CREATE TABLE IF NOT EXISTS stock_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    variant_id INT NOT NULL,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    quantity_change INT NOT NULL,
    adjustment_type VARCHAR(20) NOT NULL COMMENT 'ADD, SUBTRACT, SET',
    reason VARCHAR(500),
    reference_type VARCHAR(50) COMMENT 'ORDER, RETURN, MANUAL, INVENTORY_CHECK',
    reference_id INT,
    performed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_variant_id (variant_id),
    INDEX idx_reference (reference_type, reference_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add stock threshold columns to product_variants
ALTER TABLE product_variants 
ADD COLUMN IF NOT EXISTS low_stock_threshold INT DEFAULT 10,
ADD COLUMN IF NOT EXISTS reorder_point INT DEFAULT 5,
ADD COLUMN IF NOT EXISTS reorder_quantity INT DEFAULT 50;

-- Stock alerts table for tracking alert status
CREATE TABLE IF NOT EXISTS stock_alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    variant_id INT NOT NULL UNIQUE,
    alert_type VARCHAR(20) NOT NULL COMMENT 'LOW_STOCK, OUT_OF_STOCK',
    severity VARCHAR(20) NOT NULL COMMENT 'WARNING, CRITICAL',
    current_stock INT NOT NULL,
    threshold INT NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by INT,
    acknowledged_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    FOREIGN KEY (acknowledged_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_alert_type (alert_type),
    INDEX idx_severity (severity),
    INDEX idx_acknowledged (acknowledged)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
