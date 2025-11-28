-- Active: 1762913020837@@127.0.0.1@3306@beautyboxdb
-- Migration V2: Add MANAGER role and admin user
-- Run this script to add MANAGER role and create default admin account

-- Add MANAGER role if not exists
INSERT INTO roles (name) 
SELECT 'MANAGER' 
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'MANAGER');

-- Create default admin user
-- Password: Admin@123 (BCrypt hash)
INSERT INTO users (email, password, full_name, is_active, email_verified_at, created_at, updated_at, role_id)
SELECT 
    'admin@beautybox.com',
    '$2a$10$BtEF52bLVpZoyO0Pae3DpereB/jfgQmyF6363JvdXrVktGUXWZvB6',
    'System Administrator',
    true,
    NOW(),
    NOW(),
    NOW(),
    (SELECT id FROM roles WHERE name = 'ADMIN')
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@beautybox.com');

-- Create default manager user (optional)
-- Password: Manager@123 (BCrypt hash)
INSERT INTO users (email, password, full_name, is_active, email_verified_at, created_at, updated_at, role_id)
SELECT 
    'manager@beautybox.com',
    '$2a$10$/k.A2AbqYYSCwU6Yr3LXmO29lVvcs2n7SX1u9uvIUFLdm8Z9ajy.W',
    'Store Manager',
    true,
    NOW(),
    NOW(),
    NOW(),
    (SELECT id FROM roles WHERE name = 'MANAGER')
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'manager@beautybox.com');

-- Verify
SELECT 
    u.id,
    u.email,
    u.full_name,
    r.name as role,
    u.is_active
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE u.email IN ('admin@beautybox.com', 'manager@beautybox.com');
