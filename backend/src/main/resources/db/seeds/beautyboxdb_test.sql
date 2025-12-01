USE beautyboxdb;

-- ========================================
-- Seed data for BeautyBox (cosmetics) demo
-- 50 products, short SKU style: ABB-<id>-<suffix>
-- Created for: website mỹ phẩm
-- ========================================

-- ROLES
INSERT IGNORE INTO roles (id, name) VALUES
  (1, 'USER'),
  (2, 'MANAGER'),
  (3, 'ADMIN');

-- USERS (admin, manager, sample users)
INSERT IGNORE INTO users (id, full_name, email, password, phone_number, avatar_url, birth_day, is_active, email_verified_at, role_id, created_at, updated_at) VALUES
(1, 'System Admin', 'admin@beautybox.com', '$2a$10$exampleadminhash', '0900000000', '', '1990-01-01', 1, NOW(), 3, NOW(), NOW()),
(2, 'Store Manager', 'manager@beautybox.com', '$2a$10$examplemanagerhash', '0900000001', '', '1990-01-02', 1, NOW(), 2, NOW(), NOW()),
(3, 'Nguyễn Văn An', 'user1@example.com', '$2a$10$xQZj5example', '0901234567', 'https://i.pravatar.cc/150?img=1', '1990-05-15', 1, NOW(), 1, NOW(), NOW()),
(4, 'Trần Thị Bình', 'user2@example.com', '$2a$10$xQZj5example', '0912345678', 'https://i.pravatar.cc/150?img=5', '1992-08-20', 1, NOW(), 1, NOW(), NOW()),
(5, 'Hoàng Văn Em', 'user3@example.com', '$2a$10$xQZj5example', '0945678901', 'https://i.pravatar.cc/150?img=12', '1993-07-18', 1, NOW(), 1, NOW(), NOW());

-- BRANDS (cosmetics)
INSERT INTO brands (id, name, slug, logo_url, created_at, updated_at) VALUES
(1, 'Innisfree', 'innisfree', 'https://via.placeholder.com/120x60?text=Innisfree', NOW(), NOW()),
(2, 'COSRX', 'cosrx', 'https://via.placeholder.com/120x60?text=COSRX', NOW(), NOW()),
(3, 'La Roche-Posay', 'la-roche-posay', 'https://via.placeholder.com/120x60?text=La+Roche', NOW(), NOW()),
(4, 'Some By Mi', 'some-by-mi', 'https://via.placeholder.com/120x60?text=Some+By+Mi', NOW(), NOW()),
(5, 'The Ordinary', 'the-ordinary', 'https://via.placeholder.com/120x60?text=The+Ordinary', NOW(), NOW()),
(6, 'Cerave', 'cerave', 'https://via.placeholder.com/120x60?text=Cerave', NOW(), NOW()),
(7, '3CE', '3ce', 'https://via.placeholder.com/120x60?text=3CE', NOW(), NOW()),
(8, 'Romand', 'romand', 'https://via.placeholder.com/120x60?text=Romand', NOW(), NOW()),
(9, 'MAC', 'mac', 'https://via.placeholder.com/120x60?text=MAC', NOW(), NOW()),
(10, 'Maybelline', 'maybelline', 'https://via.placeholder.com/120x60?text=Maybelline', NOW(), NOW()),
(11, 'Bioderma', 'bioderma', 'https://via.placeholder.com/120x60?text=Bioderma', NOW(), NOW()),
(12, 'Laneige', 'laneige', 'https://via.placeholder.com/120x60?text=Laneige', NOW(), NOW()),
(13, 'Anessa', 'anessa', 'https://via.placeholder.com/120x60?text=Anessa', NOW(), NOW()),
(14, "Paula's Choice", 'paulas-choice', 'https://via.placeholder.com/120x60?text=Paulas+Choice', NOW(), NOW()),
(15, 'Vichy', 'vichy', 'https://via.placeholder.com/120x60?text=Vichy', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug), logo_url=VALUES(logo_url);

-- CATEGORIES (Option 1 - detailed)
INSERT INTO categories (id, name, slug, parent_category_id, image_url, created_at, updated_at) VALUES
-- Skincare (parent)
(1, 'Chăm Sóc Da', 'cham-soc-da', NULL, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300', NOW(), NOW()),
(2, 'Sữa Rửa Mặt', 'sua-rua-mat', 1, 'https://images.unsplash.com/photo-1580281657523-14a87b9c1e6b?w=300', NOW(), NOW()),
(3, 'Toner', 'toner', 1, 'https://images.unsplash.com/photo-1585790050230-5dd28404f123?w=300', NOW(), NOW()),
(4, 'Serum & Tinh Chất', 'serum-tinh-chat', 1, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300', NOW(), NOW()),
(5, 'Kem Dưỡng', 'kem-duong', 1, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300', NOW(), NOW()),
(6, 'Mặt Nạ', 'mat-na', 1, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300', NOW(), NOW()),
(7, 'Chống Nắng', 'chong-nang', 1, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300', NOW(), NOW()),
-- Makeup (parent)
(8, 'Trang Điểm', 'trang-diem', NULL, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300', NOW(), NOW()),
(9, 'Son Môi', 'son-moi', 8, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300', NOW(), NOW()),
(10, 'Kem Nền & Cushion', 'kem-nen-cushion', 8, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300', NOW(), NOW()),
(11, 'Phấn & Mắt', 'phan-mat', 8, 'https://images.unsplash.com/photo-1583241800698-8be492dbe2c7?w=300', NOW(), NOW()),
-- Bodycare
(12, 'Chăm Sóc Cơ Thể', 'cham-soc-co-the', NULL, 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=300', NOW(), NOW()),
-- Haircare
(13, 'Chăm Sóc Tóc', 'cham-soc-toc', NULL, 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300', NOW(), NOW()),
(14, 'Dầu Gội & Dầu Xả', 'dau-goi-dau-xa', 13, 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug), parent_category_id=VALUES(parent_category_id);

-- PRODUCTS (50 cosmetics)
-- We'll insert 50 products; IDs 1..50
INSERT INTO products (id, name, slug, description, category_id, brand_id, status, created_at, updated_at) VALUES
(1, 'Sữa Rửa Mặt Trà Xanh Innisfree', 'sua-rua-mat-tra-xanh-innisfree', 'Sữa rửa mặt trà xanh Innisfree - làm sạch sâu, dịu nhẹ.', 2, 1, 'ACTIVE', NOW(), NOW()),
(2, 'Sữa Rửa Mặt Dưỡng Ẩm Cerave', 'sua-rua-mat-duong-am-cerave', 'Sữa rửa mặt Cerave - giữ ẩm, phù hợp da khô.', 2, 6, 'ACTIVE', NOW(), NOW()),
(3, 'Toner AHA/BHA COSRX', 'toner-aha-bha-cosrx', 'Toner COSRX AHA/BHA làm sạch lỗ chân lông, cải thiện kết cấu da.', 3, 2, 'ACTIVE', NOW(), NOW()),
(4, 'Serum Niacinamide The Ordinary', 'serum-niacinamide-the-ordinary', 'Serum Niacinamide 10% The Ordinary - kiềm dầu, thu nhỏ lỗ chân lông.', 4, 5, 'ACTIVE', NOW(), NOW()),
(5, 'Serum Vitamin C Paula''s Choice', 'serum-vitamin-c-paulas-choice', 'Serum Vitamin C làm sáng da, chống oxy hóa.', 4, 14, 'ACTIVE', NOW(), NOW()),
(6, 'Kem Dưỡng Ẩm Ban Ngày La Roche-Posay', 'kem-duong-ban-ngay-la-roche-posay', 'Kem dưỡng ngày La Roche-Posay - phù hợp da nhạy cảm.', 5, 3, 'ACTIVE', NOW(), NOW()),
(7, 'Kem Dưỡng Ẩm Ban Đêm Laneige', 'kem-duong-ban-dem-laneige', 'Kem dưỡng ban đêm Laneige - phục hồi và cấp ẩm.', 5, 12, 'ACTIVE', NOW(), NOW()),
(8, 'Mặt Nạ Giấy Mediheal', 'mat-na-giay-mediheal', 'Mặt nạ giấy Mediheal - cấp nước tức thì.', 6, 11, 'ACTIVE', NOW(), NOW()),
(9, 'Mặt Nạ Ngủ Laneige', 'mat-na-ngu-laneige', 'Mặt nạ ngủ Laneige - phục hồi da qua đêm.', 6, 12, 'ACTIVE', NOW(), NOW()),
(10, 'Kem Chống Nắng Anessa SPF50+', 'kem-chong-nang-anessa-spf50', 'Kem chống nắng Anessa SPF50+ - bảo vệ da toàn diện.', 7, 13, 'ACTIVE', NOW(), NOW()),
(11, 'Tẩy Trang Micellar Bioderma', 'tay-trang-micellar-bioderma', 'Nước tẩy trang Bioderma - nhẹ nhàng tẩy trang cho da nhạy cảm.', 3, 11, 'ACTIVE', NOW(), NOW()),
(12, 'Tinh Chất Retinol Paula''s Choice 0.5%', 'tinh-chat-retinol-paulas-choice', 'Retinol 0.5% Paula''s Choice - giảm nếp nhăn, tái tạo da.', 4, 14, 'ACTIVE', NOW(), NOW()),
(13, 'Xịt Khoáng Vichy Thermal', 'xit-khoang-vichy', 'Xịt khoáng Vichy - làm dịu và cấp nước nhanh.', 1, 15, 'ACTIVE', NOW(), NOW()),
(14, 'Kem nền Cushion Laneige', 'kem-nen-cushion-laneige', 'Cushion Laneige - lớp nền tự nhiên, mịn màng.', 10, 12, 'ACTIVE', NOW(), NOW()),
(15, 'Phấn phủ Loose Powder MAC', 'phan-phu-loose-mac', 'Phấn phủ MAC - kiểm soát dầu, giữ lớp trang điểm lâu.', 11, 9, 'ACTIVE', NOW(), NOW()),
(16, 'Son Tint 3CE', 'son-tint-3ce', 'Son tint 3CE - màu chuẩn, mượt môi.', 9, 7, 'ACTIVE', NOW(), NOW()),
(17, 'Son Thỏi Matte Romand', 'son-thoi-matte-romand', 'Son thỏi Romand - finish matte, lâu trôi.', 9, 8, 'ACTIVE', NOW(), NOW()),
(18, 'Toner Dưỡng Ẩm Innisfree', 'toner-duong-am-innisfree', 'Toner Innisfree - cấp nước và làm dịu da.', 3, 1, 'ACTIVE', NOW(), NOW()),
(19, 'Serum Hyaluronic Acid The Ordinary', 'serum-hyaluronic-the-ordinary', 'Serum HA The Ordinary - cấp ẩm sâu.', 4, 5, 'ACTIVE', NOW(), NOW()),
(20, 'Kem Mắt Dưỡng 30ml Cerave', 'kem-mat-cerave-30ml', 'Kem mắt Cerave - dưỡng ẩm cho vùng mắt nhạy cảm.', 5, 6, 'ACTIVE', NOW(), NOW()),
(21, 'Dầu Gội Phục Hồi Pantene', 'dau-goi-pantene', 'Dầu gội phục hồi Pantene - giảm gãy rụng, suôn mượt.', 14, 10, 'ACTIVE', NOW(), NOW()),
(22, 'Dầu Xả Dưỡng Pantene', 'dau-xa-pantene', 'Dầu xả Pantene - nuôi dưỡng sợi tóc.', 14, 10, 'ACTIVE', NOW(), NOW()),
(23, 'Tẩy Tế Bào Chết Hoá Học Some By Mi', 'tay-te-bao-chet-some-by-mi', 'Tẩy tế bào chết Some By Mi - cải thiện kết cấu da.', 2, 4, 'ACTIVE', NOW(), NOW()),
(24, 'Mặt Nạ Ngủ Dạng Gel Laneige', 'mat-na-ngu-gel-laneige', 'Mặt nạ ngủ dạng gel - cấp ẩm, mịn da.', 6, 12, 'ACTIVE', NOW(), NOW()),
(25, 'Kem Trị Mụn Chuyên Sâu La Roche-Posay', 'kem-tri-mun-laroche', 'Kem trị mụn La Roche-Posay - giảm viêm, làm dịu.', 5, 3, 'ACTIVE', NOW(), NOW()),
(26, 'Kem Nền Liquid Foundation MAC', 'kem-nen-liquid-mac', 'Liquid foundation MAC - che phủ tốt, finish mịn.', 10, 9, 'ACTIVE', NOW(), NOW()),
(27, 'BB Cream Maybelline', 'bb-cream-maybelline', 'BB Cream Maybelline - nhẹ nhàng, phù hợp hàng ngày.', 10, 10, 'ACTIVE', NOW(), NOW()),
(28, 'Sheet Mask Lụa Innisfree', 'sheet-mask-lua-innisfree', 'Sheet mask Innisfree - chất liệu lụa mềm, dưỡng sâu.', 6, 1, 'ACTIVE', NOW(), NOW()),
(29, 'Kem Chống Nắng Cho Da Mụn La Roche-Posay', 'kcn-da-mun-la-roche', 'KCN dành cho da mụn - không gây bít tắc lỗ chân lông.', 7, 3, 'ACTIVE', NOW(), NOW()),
(30, 'Serum Làm Sáng Da Some By Mi', 'serum-lam-sang-some-by-mi', 'Serum làm sáng Some By Mi - giảm thâm, sáng đều.', 4, 4, 'ACTIVE', NOW(), NOW()),
(31, 'Sữa Tắm Dưỡng Ẩm Cocoon', 'sua-tam-cocoon', 'Sữa tắm Cocoon - nhẹ nhàng, thơm dịu.', 12, 11, 'ACTIVE', NOW(), NOW()),
(32, 'Dưỡng Thể Vaseline', 'duong-the-vaseline', 'Dưỡng thể Vaseline - cấp ẩm lâu dài cho cơ thể.', 12, 11, 'ACTIVE', NOW(), NOW()),
(33, 'Serum Tinh Chất Some By Mi 30ml', 'serum-some-by-mi-30ml', 'Serum Some By Mi 30ml - cải thiện mụn, kết cấu da.', 4, 4, 'ACTIVE', NOW(), NOW()),
(34, 'Tinh Chất The Ordinary Retinol', 'retinol-the-ordinary', 'Retinol The Ordinary - thúc đẩy tái tạo tế bào.', 4, 5, 'ACTIVE', NOW(), NOW()),
(35, 'Kem CC Cream Laneige', 'cc-cream-laneige', 'CC cream Laneige - che nhẹ, tone up tự nhiên.', 10, 12, 'ACTIVE', NOW(), NOW()),
(36, 'Mascara Maybelline', 'mascara-maybelline', 'Mascara Maybelline - dài mi, không vón cục.', 8, 10, 'ACTIVE', NOW(), NOW()),
(37, 'Son Tint Long-lasting Romand', 'son-tint-romand', 'Son tint Romand - lâu trôi, bóng nhẹ.', 9, 8, 'ACTIVE', NOW(), NOW()),
(38, 'Xịt Khoáng Innisfree', 'xit-khoang-innisfree', 'Xịt khoáng Innisfree - làm dịu tức thì.', 1, 1, 'ACTIVE', NOW(), NOW()),
(39, 'Sữa Rửa Mặt Dịu Nhẹ Bioderma', 'sua-rua-mat-bioderma', 'Sữa rửa mặt Bioderma - phù hợp da nhạy cảm.', 2, 11, 'ACTIVE', NOW(), NOW()),
(40, 'Tinh Chất Vitamin C Innisfree', 'vitamin-c-innisfree', 'Serum Vitamin C Innisfree - làm đều màu da.', 4, 1, 'ACTIVE', NOW(), NOW()),
(41, 'Kem Chống Nắng Vichy SPF50', 'kcn-vichy-spf50', 'Kem chống nắng Vichy - bảo vệ phổ rộng.', 7, 15, 'ACTIVE', NOW(), NOW()),
(42, 'Mặt Nạ Ngủ Vaseline', 'mat-na-ngu-vaseline', 'Mặt nạ ngủ Vaseline - dưỡng phục hồi ban đêm.', 6, 11, 'ACTIVE', NOW(), NOW()),
(43, 'Serum Dưỡng Tóc Pantene', 'serum-duong-toc-pantene', 'Tinh chất dưỡng tóc Pantene - phục hồi hư tổn.', 13, 10, 'ACTIVE', NOW(), NOW()),
(44, 'Kem Dưỡng Tay Laneige', 'kem-duong-tay-laneige', 'Kem dưỡng tay Laneige - mềm mịn, không nhờn.', 12, 12, 'ACTIVE', NOW(), NOW()),
(45, 'Sữa Rửa Mặt Bọt The Ordinary', 'sua-rua-mat-the-ordinary', 'Sữa rửa mặt tạo bọt nhẹ, làm sạch hiệu quả.', 2, 5, 'ACTIVE', NOW(), NOW()),
(46, 'Mặt Nạ Bùn Vichy', 'mat-na-bun-vichy', 'Mặt nạ bùn Vichy - hút dầu, làm sạch sâu.', 6, 15, 'ACTIVE', NOW(), NOW()),
(47, 'Toner Dưỡng Da Paula''s Choice', 'toner-paulas-choice', 'Toner Paula''s Choice - cân bằng độ pH, làm sạch sâu.', 3, 14, 'ACTIVE', NOW(), NOW()),
(48, 'Son Thỏi MAC Classic', 'son-thoi-mac', 'Son thỏi MAC - màu chuẩn, sang trọng.', 9, 9, 'ACTIVE', NOW(), NOW()),
(49, 'Phấn Mắt Palette Romand', 'phan-mat-romand', 'Palette mắt Romand - nhiều tông phù hợp mọi mục đích.', 11, 8, 'ACTIVE', NOW(), NOW()),
(50, 'Kem Dưỡng Mặt Ban Đêm Vichy', 'kem-duong-ban-dem-vichy', 'Kem dưỡng ban đêm Vichy - phục hồi da tối ưu.', 5, 15, 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug), description=VALUES(description);

-- PRODUCT IMAGES (2 images per product)
INSERT INTO product_images (id, product_id, image_url) VALUES
(1, 1, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&prod=1'),
(2, 1, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&prod=1'),
(3, 2, 'https://images.unsplash.com/photo-1585790050230-5dd28404f123?w=800&prod=2'),
(4, 2, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&prod=2'),
(5, 3, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&prod=3'),
(6, 3, 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&prod=3'),
(7, 4, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&prod=4'),
(8, 4, 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&prod=4'),
(9, 5, 'https://images.unsplash.com/photo-1608242155250-64b9f1f9c194?w=800&prod=5'),
(10, 5, 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800&prod=5'),
(11, 6, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&prod=6'),
(12, 6, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&prod=6'),
(13, 7, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&prod=7'),
(14, 7, 'https://images.unsplash.com/photo-1561154464-82e9adf32765?w=800&prod=7'),
(15, 8, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&prod=8'),
(16, 8, 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800&prod=8'),
(17, 9, 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&prod=9'),
(18, 9, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&prod=9'),
(19, 10, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&prod=10'),
(20, 10, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&prod=10'),
(21, 11, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&prod=11'),
(22, 11, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&prod=11'),
(23, 12, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&prod=12'),
(24, 12, 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&prod=12'),
(25, 13, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&prod=13'),
(26, 13, 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&prod=13'),
(27, 14, 'https://images.unsplash.com/photo-1583241800698-8be492dbe2c7?w=800&prod=14'),
(28, 14, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&prod=14'),
(29, 15, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&prod=15'),
(30, 15, 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&prod=15'),
(31, 16, 'https://images.unsplash.com/photo-1608242155250-64b9f1f9c194?w=800&prod=16'),
(32, 16, 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800&prod=16'),
(33, 17, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&prod=17'),
(34, 17, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&prod=17'),
(35, 18, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&prod=18'),
(36, 18, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&prod=18'),
(37, 19, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&prod=19'),
(38, 19, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&prod=19'),
(39, 20, 'https://images.unsplash.com/photo-1585790050230-5dd28404f123?w=800&prod=20'),
(40, 20, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&prod=20'),
(41, 21, 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&prod=21'),
(42, 21, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&prod=21'),
(43, 22, 'https://images.unsplash.com/photo-1583241800698-8be492dbe2c7?w=800&prod=22'),
(44, 22, 'https://images.unsplash.com/photo-1561154464-82e9adf32765?w=800&prod=22'),
(45, 23, 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800&prod=23'),
(46, 23, 'https://images.unsplash.com/photo-1608242155250-64b9f1f9c194?w=800&prod=23'),
(47, 24, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&prod=24'),
(48, 24, 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&prod=24'),
(49, 25, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&prod=25'),
(50, 25, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&prod=25'),
(51, 26, 'https://images.unsplash.com/photo-1585790050230-5dd28404f123?w=800&prod=26'),
(52, 26, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&prod=26'),
(53, 27, 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&prod=27'),
(54, 27, 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800&prod=27'),
(55, 28, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&prod=28'),
(56, 28, 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&prod=28'),
(57, 29, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&prod=29'),
(58, 29, 'https://images.unsplash.com/photo-1583241800698-8be492dbe2c7?w=800&prod=29'),
(59, 30, 'https://images.unsplash.com/photo-1608242155250-64b9f1f9c194?w=800&prod=30'),
(60, 30, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&prod=30'),
(61, 31, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&prod=31'),
(62, 31, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&prod=31'),
(63, 32, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&prod=32'),
(64, 32, 'https://images.unsplash.com/photo-1561154464-82e9adf32765?w=800&prod=32'),
(65, 33, 'https://images.unsplash.com/photo-1585790050230-5dd28404f123?w=800&prod=33'),
(66, 33, 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&prod=33'),
(67, 34, 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800&prod=34'),
(68, 34, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&prod=34'),
(69, 35, 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&prod=35'),
(70, 35, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&prod=35'),
(71, 36, 'https://images.unsplash.com/photo-1583241800698-8be492dbe2c7?w=800&prod=36'),
(72, 36, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&prod=36'),
(73, 37, 'https://images.unsplash.com/photo-1608242155250-64b9f1f9c194?w=800&prod=37'),
(74, 37, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&prod=37'),
(75, 38, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&prod=38'),
(76, 38, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&prod=38'),
(77, 39, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&prod=39'),
(78, 39, 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&prod=39'),
(79, 40, 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800&prod=40'),
(80, 40, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&prod=40'),
(81, 41, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&prod=41'),
(82, 41, 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&prod=41'),
(83, 42, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&prod=42'),
(84, 42, 'https://images.unsplash.com/photo-1583241800698-8be492dbe2c7?w=800&prod=42'),
(85, 43, 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&prod=43'),
(86, 43, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&prod=43'),
(87, 44, 'https://images.unsplash.com/photo-1608242155250-64b9f1f9c194?w=800&prod=44'),
(88, 44, 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800&prod=44'),
(89, 45, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&prod=45'),
(90, 45, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&prod=45'),
(91, 46, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&prod=46'),
(92, 46, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&prod=46'),
(93, 47, 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800&prod=47'),
(94, 47, 'https://images.unsplash.com/photo-1585790050230-5dd28404f123?w=800&prod=47'),
(95, 48, 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&prod=48'),
(96, 48, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&prod=48'),
(97, 49, 'https://images.unsplash.com/photo-1583241800698-8be492dbe2c7?w=800&prod=49'),
(98, 49, 'https://images.unsplash.com/photo-1561154464-82e9adf32765?w=800&prod=49'),
(99, 50, 'https://images.unsplash.com/photo-1608242155250-64b9f1f9c194?w=800&prod=50'),
(100, 50, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&prod=50')
ON DUPLICATE KEY UPDATE image_url=VALUES(image_url);

-- PRODUCT VARIANTS (one variant per product for demo; ids start at 201)
INSERT INTO product_variants (id, product_id, name, sku, price, sale_price, stock_quantity) VALUES
(201, 1, 'Sữa Rửa Mặt Trà Xanh 150ml', 'INN-001-150', 320000, NULL, 120),
(202, 2, 'Sữa Rửa Mặt Dưỡng Ẩm 150ml', 'CER-002-150', 300000, NULL, 100),
(203, 3, 'Toner AHA/BHA 150ml', 'COS-003-150', 350000, 320000, 80),
(204, 4, 'Serum Niacinamide 30ml', 'THE-004-30', 420000, 380000, 150),
(205, 5, 'Serum Vitamin C 30ml', 'PAU-005-30', 500000, 450000, 90),
(206, 6, 'Kem Dưỡng Ban Ngày 50ml', 'LRP-006-50', 450000, 420000, 70),
(207, 7, 'Kem Dưỡng Ban Đêm 50ml', 'LAN-007-50', 420000, 390000, 60),
(208, 8, 'Mặt Nạ Giấy (1 miếng)', 'MED-008-01', 50000, NULL, 300),
(209, 9, 'Mặt Nạ Ngủ 70ml', 'LAN-009-70', 750000, 700000, 40),
(210, 10, 'Kem Chống Nắng SPF50+ 50ml', 'ANE-010-50', 390000, 360000, 200),
(211, 11, 'Tẩy Trang Micellar 250ml', 'BIO-011-250', 280000, NULL, 150),
(212, 12, 'Tinh Chất Retinol 30ml', 'PAU-012-30', 620000, 580000, 50),
(213, 13, 'Xịt Khoáng 150ml', 'VIC-013-150', 220000, NULL, 180),
(214, 14, 'Cushion 15g', 'LAN-014-15', 690000, 650000, 70),
(215, 15, 'Phấn Phủ 20g', 'MAC-015-20', 550000, NULL, 80),
(216, 16, 'Son Tint 3CE 5g', '3CE-016-05', 320000, NULL, 110),
(217, 17, 'Son Thỏi Romand 3.5g', 'ROM-017-35', 280000, NULL, 100),
(218, 18, 'Toner Dưỡng 200ml', 'INN-018-200', 250000, NULL, 140),
(219, 19, 'Serum HA 30ml', 'THE-019-30', 390000, 360000, 160),
(220, 20, 'Kem Mắt 30ml', 'CER-020-30', 320000, NULL, 120),
(221, 21, 'Dầu Gội Pantene 400ml', 'PAN-021-400', 150000, 130000, 200),
(222, 22, 'Dầu Xả Pantene 400ml', 'PAN-022-400', 150000, NULL, 200),
(223, 23, 'Tẩy TBC Some By Mi 100ml', 'SOM-023-100', 280000, 250000, 110),
(224, 24, 'Mặt Nạ Ngủ Gel 70ml', 'LAN-024-70', 680000, 650000, 60),
(225, 25, 'Kem Trị Mụn 30ml', 'LRP-025-30', 410000, 380000, 90),
(226, 26, 'Liquid Foundation 30ml', 'MAC-026-30', 800000, 760000, 50),
(227, 27, 'BB Cream 30ml', 'MAY-027-30', 220000, 200000, 140),
(228, 28, 'Sheet Mask (1 miếng)', 'INN-028-01', 45000, NULL, 300),
(229, 29, 'KCN Cho Da Mụn 50ml', 'LRP-029-50', 420000, 400000, 120),
(230, 30, 'Serum Làm Sáng 30ml', 'SOM-030-30', 360000, 320000, 100),
(231, 31, 'Sữa Tắm Cocoon 500ml', 'COC-031-500', 150000, NULL, 200),
(232, 32, 'Dưỡng Thể Vaseline 200ml', 'VAS-032-200', 120000, NULL, 220),
(233, 33, 'Serum Some By Mi 30ml', 'SOM-033-30', 380000, 350000, 90),
(234, 34, 'Retinol The Ordinary 30ml', 'THE-034-30', 520000, 480000, 70),
(235, 35, 'CC Cream Laneige 30ml', 'LAN-035-30', 300000, 280000, 130),
(236, 36, 'Mascara Maybelline 10ml', 'MAY-036-10', 180000, NULL, 160),
(237, 37, 'Son Tint Romand 5g', 'ROM-037-05', 300000, 270000, 110),
(238, 38, 'Xịt Khoáng Innisfree 150ml', 'INN-038-150', 200000, NULL, 150),
(239, 39, 'Sữa Rửa Mặt Bioderma 150ml', 'BIO-039-150', 320000, NULL, 130),
(240, 40, 'Vitamin C Innisfree 30ml', 'INN-040-30', 380000, 350000, 120),
(241, 41, 'KCN Vichy SPF50 50ml', 'VIC-041-50', 430000, 400000, 110),
(242, 42, 'Mặt Nạ Ngủ Vaseline 70ml', 'VAS-042-70', 280000, NULL, 80),
(243, 43, 'Serum Dưỡng Tóc 100ml', 'PAN-043-100', 240000, NULL, 140),
(244, 44, 'Kem Dưỡng Tay Laneige 50ml', 'LAN-044-50', 180000, NULL, 170),
(245, 45, 'Sữa Rửa Mặt The Ordinary 150ml', 'THE-045-150', 260000, NULL, 140),
(246, 46, 'Mặt Nạ Bùn Vichy 50ml', 'VIC-046-50', 350000, NULL, 90),
(247, 47, 'Toner Paula''s Choice 200ml', 'PAU-047-200', 420000, 390000, 80),
(248, 48, 'Son Thỏi MAC 3.5g', 'MAC-048-35', 600000, NULL, 70),
(249, 49, 'Palette Mắt Romand', 'ROM-049-PA', 450000, NULL, 60),
(250, 50, 'Kem Dưỡng Ban Đêm Vichy 50ml', 'VIC-050-50', 650000, 600000, 50)
ON DUPLICATE KEY UPDATE name=VALUES(name), sku=VALUES(sku), price=VALUES(price);

-- VARIANT ATTRIBUTES (where relevant)
INSERT INTO variant_attributes (id, product_variant_id, name, value) VALUES
(1, 201, 'Dung tích', '150ml'),
(2, 202, 'Dung tích', '150ml'),
(3, 203, 'Dung tích', '150ml'),
(4, 204, 'Dung tích', '30ml'),
(5, 205, 'Dung tích', '30ml'),
(6, 206, 'Dung tích', '50ml'),
(7, 207, 'Dung tích', '50ml'),
(8, 208, 'Số miếng', '1'),
(9, 209, 'Dung tích', '70ml'),
(10, 210, 'Dung tích', '50ml'),
(11, 211, 'Dung tích', '250ml'),
(12, 212, 'Dung tích', '30ml'),
(13, 216, 'Trọng lượng', '5g'),
(14, 217, 'Trọng lượng', '3.5g'),
(15, 218, 'Dung tích', '200ml'),
(16, 219, 'Dung tích', '30ml'),
(17, 221, 'Dung tích', '400ml'),
(18, 223, 'Dung tích', '100ml'),
(19, 228, 'Số miếng', '1'),
(20, 229, 'Dung tích', '50ml'),
(21, 230, 'Dung tích', '30ml'),
(22, 231, 'Dung tích', '500ml'),
(23, 232, 'Dung tích', '200ml'),
(24, 234, 'Dung tích', '30ml'),
(25, 236, 'Dung tích', '10ml'),
(26, 241, 'Dung tích', '50ml'),
(27, 250, 'Dung tích', '50ml')
ON DUPLICATE KEY UPDATE name=VALUES(name), value=VALUES(value);

-- PAYMENT METHODS
INSERT INTO payment_method (id, name, code, is_active, payment_id, created_at, updated_at) VALUES
(1, 'Thanh toán khi nhận hàng (COD)', 'COD', 1, NULL, NOW(), NOW()),
(2, 'Chuyển khoản ngân hàng', 'BANK', 1, NULL, NOW(), NOW()),
(3, 'Thẻ tín dụng/Ghi nợ', 'CARD', 1, NULL, NOW(), NOW()),
(4, 'Ví Momo', 'MOMO', 1, NULL, NOW(), NOW()),
(5, 'ZaloPay', 'ZALO', 1, NULL, NOW(), NOW()),
(6, 'VNPay', 'VNPAY', 1, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name), code=VALUES(code);

-- COUPONS (sample, cosmetics-focused)
INSERT INTO coupons (id, code, description, is_active, discount_type, discount_value, min_order_value, max_usage_value, valid_from, valid_to, created_by_user_id, created_at, updated_at) VALUES
(1, 'WELCOME10', 'Giảm 10% cho đơn hàng đầu tiên', 1, 'PERCENTAGE', 10.00, 200000, 100000, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1, NOW(), NOW()),
(2, 'NEW50K', 'Giảm 50,000đ cho thành viên mới', 1, 'FIXED', 50000.00, 300000, 50000, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY), 1, NOW(), NOW()),
(3, 'SKIN20', 'Giảm 20% cho sản phẩm chăm sóc da', 1, 'PERCENTAGE', 20.00, 400000, 200000, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 2, NOW(), NOW())
ON DUPLICATE KEY UPDATE description=VALUES(description), discount_value=VALUES(discount_value);

-- ADDRESSES
INSERT INTO addresses (id, user_id, recipient_name, recipient_phone, street_address, ward, district, city, is_default, created_at, updated_at) VALUES
(1, 3, 'Nguyễn Văn An', '0901234567', '123 Nguyễn Văn Linh', 'Phường Tân Phú', 'Quận 7', 'TP. Hồ Chí Minh', 1, NOW(), NOW()),
(2, 4, 'Trần Thị Bình', '0912345678', '789 Võ Văn Tần', 'Phường 6', 'Quận 3', 'TP. Hồ Chí Minh', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE recipient_name=VALUES(recipient_name);

-- CARTS
INSERT INTO carts (id, user_id, created_at, updated_at) VALUES
(1, 3, NOW(), NOW()),
(2, 4, NOW(), NOW())
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);

-- CART ITEMS (sample)
INSERT INTO cart_items (id, cart_id, product_variant_id, quantity) VALUES
(1, 1, 201, 1),
(2, 1, 204, 1),
(3, 2, 210, 1),
(4, 2, 216, 2)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity);

-- FAVORITE LIST (sample)
INSERT INTO favorite_list (id, user_id, product_id) VALUES
(1, 3, 4),
(2, 3, 8),
(3, 4, 10),
(4, 4, 16),
(5, 5, 19)
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);

-- ORDERS (sample)
INSERT INTO orders (id, user_id, status, subtotal, discount_amount, shipping_fee, total_amount, notes, estimate_delivery_from, estimate_delivery_to, created_at, updated_at) VALUES
(1, 3, 'DELIVERED', 740000, 0, 30000, 770000, 'Giao giờ hành chính', DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY), NOW(), NOW()),
(2, 4, 'SHIPPED', 360000, 0, 30000, 390000, '', DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 4 DAY), NOW(), NOW())
ON DUPLICATE KEY UPDATE status=VALUES(status), total_amount=VALUES(total_amount);

-- ORDER ITEMS
INSERT INTO order_items (id, order_id, product_variant_id, quantity) VALUES
(1, 1, 204, 1),
(2, 1, 208, 2),
(3, 2, 216, 1)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity);

-- RECIPIENT INFORMATION
INSERT INTO recipient_information (id, order_id, recipient_first_name, recipient_last_name, recipient_phone, recipient_email, shipping_recipient_address, is_another_receiver, created_at) VALUES
(1, 1, 'Nguyễn', 'Văn An', '0901234567', 'user1@example.com', '123 Nguyễn Văn Linh, Quận 7, TP.HCM', 0, NOW()),
(2, 2, 'Trần', 'Thị Bình', '0912345678', 'user2@example.com', '789 Võ Văn Tần, Quận 3, TP.HCM', 0, NOW())
ON DUPLICATE KEY UPDATE recipient_phone=VALUES(recipient_phone);

-- PAYMENTS
INSERT INTO payment (id, order_id, payment_method_id, amount, status, transaction_code, provider_response, created_at, updated_at) VALUES
(1, 1, 1, 770000, 'COMPLETED', 'TXN20250101001', 'Success', NOW(), NOW()),
(2, 2, 4, 390000, 'PENDING', 'MOMO20250102001', 'Pending', NOW(), NOW())
ON DUPLICATE KEY UPDATE status=VALUES(status), amount=VALUES(amount);

-- SHIPMENTS
INSERT INTO shipments (id, order_id, tracking_code, shipping_provider_name, status, shipped_at, delivered_at, created_at, updated_at) VALUES
(1, 1, 'GHN20250101001', 'GHN', 'DELIVERED', DATE_SUB(NOW(), INTERVAL 3 DAY), NOW(), DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),
(2, 2, 'GHTK20250102001', 'GHTK', 'SHIPPED', DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW())
ON DUPLICATE KEY UPDATE status=VALUES(status), tracking_code=VALUES(tracking_code);

-- ORDER STATUS HISTORY
INSERT INTO order_status_history (id, order_id, status, created_at, updated_at) VALUES
(1, 1, 'PENDING', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
(2, 1, 'CONFIRMED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 1, 'SHIPPED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, 1, 'DELIVERED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 2, 'PENDING', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(6, 2, 'CONFIRMED', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- REVIEWS (sample)
INSERT INTO reviews (id, user_id, product_id, content, rating, title, email, nickname, is_recommend, created_at, updated_at) VALUES
(1, 3, 4, 'Sản phẩm rất hiệu quả, da mình mịn hơn sau 1 tuần.', 5, 'Rất hài lòng', 'user1@example.com', 'NgAn', 1, NOW(), NOW()),
(2, 4, 16, 'Son lên màu đẹp, bền màu trong 4-5 tiếng.', 4, 'Đẹp và bền', 'user2@example.com', 'TrBinh', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE content=VALUES(content), rating=VALUES(rating);

-- REVIEW IMAGES
INSERT INTO review_images (id, review_id, image_url) VALUES
(1, 1, 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800'),
(2, 2, 'https://images.unsplash.com/photo-1608242155250-64b9f1f9c194?w=800')
ON DUPLICATE KEY UPDATE image_url=VALUES(image_url);

-- MAIL OTP CODES (for testing)
INSERT INTO mail_otp_codes (id, email, code, purpose, consumed, attempts, expires_at, created_at) VALUES
(1, 'test@example.com', '123456', 'LOGIN', 0, 0, DATE_ADD(NOW(), INTERVAL 5 MINUTE), NOW())
ON DUPLICATE KEY UPDATE code=VALUES(code);

-- END OF SEED
