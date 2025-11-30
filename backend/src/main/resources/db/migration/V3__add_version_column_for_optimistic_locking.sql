-- V3: Add version column for optimistic locking on product_variants table
-- This prevents race conditions when multiple concurrent orders try to update stock

ALTER TABLE product_variants 
ADD COLUMN version BIGINT DEFAULT 0;

-- Update existing rows to have version 0
UPDATE product_variants SET version = 0 WHERE version IS NULL;

-- Make version NOT NULL after setting defaults
ALTER TABLE product_variants 
MODIFY COLUMN version BIGINT NOT NULL DEFAULT 0;
