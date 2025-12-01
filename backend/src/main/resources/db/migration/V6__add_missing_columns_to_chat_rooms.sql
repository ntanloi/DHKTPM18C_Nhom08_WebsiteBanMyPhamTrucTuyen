-- V6: Add missing columns to chat_rooms table

-- Add feedback column
ALTER TABLE chat_rooms ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Add subject column
ALTER TABLE chat_rooms ADD COLUMN IF NOT EXISTS subject VARCHAR(255);

-- Add rating column (in case not exists)
ALTER TABLE chat_rooms ADD COLUMN IF NOT EXISTS rating INT CHECK (rating BETWEEN 1 AND 5);
