-- Migration V13: Add SUPPORT role for customer support staff
-- This role allows staff to chat with customers without full MANAGER permissions

-- Add SUPPORT role if not exists
INSERT INTO roles (name) 
SELECT 'SUPPORT' 
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'SUPPORT');

-- Create default support user for testing
-- Password: Support123@ (BCrypt hash)
INSERT INTO users (email, password, full_name, phone_number, is_active, email_verified_at, created_at, updated_at, role_id)
SELECT 
    'support@beautybox.com',
    '$2a$10$BtEF52bLVpZoyO0Pae3DpereB/jfgQmyF6363JvdXrVktGUXWZvB6',
    'Support Staff',
    '0987654321',
    true,
    NOW(),
    NOW(),
    NOW(),
    (SELECT id FROM roles WHERE name = 'SUPPORT')
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'support@beautybox.com');

-- Verify roles
SELECT id, name FROM roles ORDER BY id;
