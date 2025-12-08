-- V6: Add missing columns to chat_rooms table

-- Add feedback column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'beautyboxdb' AND TABLE_NAME = 'chat_rooms' AND COLUMN_NAME = 'feedback';
SET @query = IF(@col_exists = 0, 'ALTER TABLE chat_rooms ADD COLUMN feedback TEXT', 'SELECT "Column feedback already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add subject column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'beautyboxdb' AND TABLE_NAME = 'chat_rooms' AND COLUMN_NAME = 'subject';
SET @query = IF(@col_exists = 0, 'ALTER TABLE chat_rooms ADD COLUMN subject VARCHAR(255)', 'SELECT "Column subject already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add rating column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'beautyboxdb' AND TABLE_NAME = 'chat_rooms' AND COLUMN_NAME = 'rating';
SET @query = IF(@col_exists = 0, 'ALTER TABLE chat_rooms ADD COLUMN rating INT CHECK (rating BETWEEN 1 AND 5)', 'SELECT "Column rating already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;
