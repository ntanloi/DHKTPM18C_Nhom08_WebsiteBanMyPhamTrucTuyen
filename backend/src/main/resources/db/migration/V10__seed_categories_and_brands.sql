-- V10: Seed categories and brands for BeautyBox product data
-- Categories and brands must exist before products can be inserted

-- =====================================================
-- CATEGORIES
-- =====================================================
INSERT INTO categories (id, name, slug, parent_category_id, image_url, created_at, updated_at) VALUES
(1, 'Xịt Khoáng', 'xit-khoang', NULL, 'https://image.hsv-tech.io/bbx/common/cat-xit-khoang.webp', NOW(), NOW()),
(2, 'Sữa Rửa Mặt', 'sua-rua-mat', NULL, 'https://image.hsv-tech.io/bbx/common/cat-sua-rua-mat.webp', NOW(), NOW()),
(3, 'Toner / Nước Hoa Hồng', 'toner-nuoc-hoa-hong', NULL, 'https://image.hsv-tech.io/bbx/common/cat-toner.webp', NOW(), NOW()),
(4, 'Serum / Tinh Chất', 'serum-tinh-chat', NULL, 'https://image.hsv-tech.io/bbx/common/cat-serum.webp', NOW(), NOW()),
(5, 'Kem Dưỡng', 'kem-duong', NULL, 'https://image.hsv-tech.io/bbx/common/cat-kem-duong.webp', NOW(), NOW()),
(6, 'Mặt Nạ', 'mat-na', NULL, 'https://image.hsv-tech.io/bbx/common/cat-mat-na.webp', NOW(), NOW()),
(7, 'Chống Nắng', 'chong-nang', NULL, 'https://image.hsv-tech.io/bbx/common/cat-chong-nang.webp', NOW(), NOW()),
(8, 'Trang Điểm', 'trang-diem', NULL, 'https://image.hsv-tech.io/bbx/common/cat-trang-diem.webp', NOW(), NOW()),
(9, 'Son Môi', 'son-moi', NULL, 'https://image.hsv-tech.io/bbx/common/cat-son-moi.webp', NOW(), NOW()),
(10, 'Chăm Sóc Tóc', 'cham-soc-toc', NULL, 'https://image.hsv-tech.io/bbx/common/cat-cham-soc-toc.webp', NOW(), NOW()),
(11, 'Chăm Sóc Cơ Thể', 'cham-soc-co-the', NULL, 'https://image.hsv-tech.io/bbx/common/cat-cham-soc-co-the.webp', NOW(), NOW()),
(12, 'Nước Tẩy Trang', 'nuoc-tay-trang', NULL, 'https://image.hsv-tech.io/bbx/common/cat-nuoc-tay-trang.webp', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    slug = VALUES(slug),
    image_url = VALUES(image_url),
    updated_at = NOW();

-- =====================================================
-- BRANDS
-- =====================================================
-- Insert brands with ON DUPLICATE KEY to avoid conflicts with existing data
INSERT INTO brands (id, name, slug, logo_url, created_at, updated_at) VALUES
-- Brands from scraper data (IDs match brandId in scraped products)
(2, 'Aestura', 'aestura', 'https://image.hsv-tech.io/bbx/common/brand-aestura.webp', NOW(), NOW()),
(3, 'AHC', 'ahc', 'https://image.hsv-tech.io/bbx/common/brand-ahc.webp', NOW(), NOW()),
(5, 'Avene', 'avene', 'https://image.hsv-tech.io/bbx/common/brand-avene.webp', NOW(), NOW()),
(6, 'Beyond', 'beyond', 'https://image.hsv-tech.io/bbx/common/brand-beyond.webp', NOW(), NOW()),
(7, 'Bioderma', 'bioderma', 'https://image.hsv-tech.io/bbx/common/brand-bioderma.webp', NOW(), NOW()),
(9, 'CNP Laboratory', 'cnp-laboratory', 'https://image.hsv-tech.io/bbx/common/brand-cnp.webp', NOW(), NOW()),
(10, 'Cocoon', 'cocoon', 'https://image.hsv-tech.io/bbx/common/brand-cocoon.webp', NOW(), NOW()),
(11, 'Dear Dahlia', 'dear-dahlia', 'https://image.hsv-tech.io/bbx/common/brand-dear-dahlia.webp', NOW(), NOW()),
(13, 'Clio', 'clio', 'https://image.hsv-tech.io/bbx/common/brand-clio.webp', NOW(), NOW()),
(17, 'La Roche-Posay', 'la-roche-posay', 'https://image.hsv-tech.io/bbx/common/brand-la-roche-posay.webp', NOW(), NOW()),
(19, 'Obagi', 'obagi', 'https://image.hsv-tech.io/bbx/common/brand-obagi.webp', NOW(), NOW()),
(21, 'Ohui', 'ohui', 'https://image.hsv-tech.io/bbx/common/brand-ohui.webp', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    slug = VALUES(slug),
    logo_url = VALUES(logo_url),
    updated_at = NOW();

-- Also insert some additional popular Korean/International cosmetic brands
INSERT INTO brands (id, name, slug, logo_url, created_at, updated_at) VALUES
(22, 'Innisfree', 'innisfree', 'https://image.hsv-tech.io/bbx/common/brand-innisfree.webp', NOW(), NOW()),
(23, 'Laneige', 'laneige', 'https://image.hsv-tech.io/bbx/common/brand-laneige.webp', NOW(), NOW()),
(24, 'Sulwhasoo', 'sulwhasoo', 'https://image.hsv-tech.io/bbx/common/brand-sulwhasoo.webp', NOW(), NOW()),
(25, 'SK-II', 'sk-ii', 'https://image.hsv-tech.io/bbx/common/brand-sk-ii.webp', NOW(), NOW()),
(26, 'The Face Shop', 'the-face-shop', 'https://image.hsv-tech.io/bbx/common/brand-the-face-shop.webp', NOW(), NOW()),
(27, 'Etude House', 'etude-house', 'https://image.hsv-tech.io/bbx/common/brand-etude-house.webp', NOW(), NOW()),
(28, 'Missha', 'missha', 'https://image.hsv-tech.io/bbx/common/brand-missha.webp', NOW(), NOW()),
(29, 'COSRX', 'cosrx', 'https://image.hsv-tech.io/bbx/common/brand-cosrx.webp', NOW(), NOW()),
(30, 'Some By Mi', 'some-by-mi', 'https://image.hsv-tech.io/bbx/common/brand-some-by-mi.webp', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    slug = VALUES(slug),
    logo_url = VALUES(logo_url),
    updated_at = NOW();
