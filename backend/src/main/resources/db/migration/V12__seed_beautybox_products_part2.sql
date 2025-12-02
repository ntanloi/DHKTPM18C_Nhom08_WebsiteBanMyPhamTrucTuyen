-- V12: Seed products from BeautyBox scraper data (Part 2: Products 21-56)
-- Products from CNP, Cocoon, Dear Dahlia, Clio, La Roche-Posay, Obagi, Ohui brands

-- =====================================================
-- PRODUCTS (Part 2)
-- =====================================================
INSERT INTO products (id, name, slug, description, category_id, brand_id, status, created_at, updated_at) VALUES

-- CNP Laboratory products (brand_id = 9)
(121, 'Toner Dưỡng Sáng CNP Laboratory Vita-B Energy Ampule Toner 200ml', 'toner-duong-sang-da-cnp-laboratory-vita-b-energy-ampule-toner-200ml',
'Công dụng chính: Tinh chất chống oxy hóa, dưỡng ẩm, làm sáng và mờ vết thâm nám cho làn da đều màu.
Loại da phù hợp: Mọi loại da, đặc biệt là da thiếu sức sống, xuống màu.
Thành phần chính: Vitamin B3, B5, B6, B7, B9, B12.',
3, 9, 'ACTIVE', NOW(), NOW()),

(122, 'Serum Giảm Mụn CNP Laboratory Propolis Energy Ampule 15ml', 'serum-giam-mun-lam-diu-da-cnp-laboratory-propolis-energy-ampule-15ml',
'Công dụng chính: Giảm mụn, kháng khuẩn, phục hồi da và dưỡng ẩm mịn màng nhờ tinh chất keo ong nguyên chất.
Loại da phù hợp: Da mụn, da dầu, da hỗn hợp thiên dầu.
Thành phần chính: Chiết xuất keo ong 15%, Honey Ceramide.',
4, 9, 'ACTIVE', NOW(), NOW()),

(123, 'Kem Dưỡng Da CNP Laboratory Propolis Ampule Oil In Cream 50ml', 'kem-duong-da-cnp-laboratory-propolis-ampule-oil-in-cream-50ml',
'Công dụng chính: Nuôi dưỡng làn da mịn màng, bổ sung dưỡng chất, cấp ẩm và giảm viêm mụn hiệu quả.
Loại da phù hợp: Mọi loại da, đặc biệt là da mụn.
Thành phần chính: Chiết xuất keo ong 10%, squalene.',
5, 9, 'ACTIVE', NOW(), NOW()),

(124, 'Mặt Nạ Chống Lão Hóa Căng Mịn Da CNP Laboratory Propolis Energy Ampule Mask 5 Miếng', 'mat-na-chong-lao-hoa-cang-min-da-cnp-laboratory-propolis-energy-ampule-mask-5-mieng',
'Công dụng chính: Thẩm thấu nhanh dưỡng chất vào da, cung cấp độ ẩm và ngăn ngừa lão hóa, giúp làn da căng mịn.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Chiết xuất keo ong, mật ong.',
6, 9, 'ACTIVE', NOW(), NOW()),

-- Cocoon products (brand_id = 10)
(125, 'Nước Tẩy Trang Cocoon Bí Đao Winter Melon Micellar Water 500ml', 'nuoc-tay-trang-cocoon-bi-dao-winter-melon-micellar-water-500ml',
'Công dụng chính: Làm sạch da, loại bỏ lớp trang điểm và bụi bẩn mà không gây khô căng, giúp da sạch thoáng.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Chiết xuất bí đao, nước micelle.',
3, 10, 'ACTIVE', NOW(), NOW()),

(126, 'Sữa Rửa Mặt Cocoon Dừa Bến Tre Làm Sạch Sâu Winter Melon Pore Cleanser 140ml', 'sua-rua-mat-cocoon-dua-ben-tre-lam-sach-sau-winter-melon-pore-cleanser-140ml',
'Công dụng chính: Làm sạch sâu, loại bỏ bã nhờn và bụi bẩn trong lỗ chân lông, mang lại làn da sạch mịn.
Loại da phù hợp: Da dầu, da hỗn hợp.
Thành phần chính: Dầu dừa Bến Tre, chiết xuất bí đao.',
2, 10, 'ACTIVE', NOW(), NOW()),

(127, 'Toner Cocoon Hoa Hồng Rose Water Calming Toner 310ml', 'toner-cocoon-hoa-hong-rose-water-calming-toner-310ml',
'Công dụng chính: Cân bằng độ pH, cấp ẩm và làm dịu da, mang lại làn da căng mọng, tươi tắn.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Nước hoa hồng hữu cơ, chiết xuất hoa hồng.',
3, 10, 'ACTIVE', NOW(), NOW()),

(128, 'Serum Cocoon Vitamin C Bưởi Da Xanh Pomelo Vitamin C Serum 30ml', 'serum-cocoon-vitamin-c-buoi-da-xanh-pomelo-vitamin-c-serum-30ml',
'Công dụng chính: Làm sáng da, mờ thâm nám và chống oxy hóa, giúp da đều màu và tươi sáng hơn.
Loại da phù hợp: Mọi loại da, đặc biệt da thâm sạm.
Thành phần chính: Vitamin C, chiết xuất bưởi da xanh Việt Nam.',
4, 10, 'ACTIVE', NOW(), NOW()),

(129, 'Kem Dưỡng Ẩm Cocoon Cà Phê Đắk Lắk Coffee Eye Cream 15ml', 'kem-duong-mat-cocoon-ca-phe-dak-lak-coffee-eye-cream-15ml',
'Công dụng chính: Giảm quầng thâm, bọng mắt và nếp nhăn vùng mắt, giúp mắt tươi sáng hơn.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Tinh chất cà phê Đắk Lắk, caffeine.',
5, 10, 'ACTIVE', NOW(), NOW()),

-- Dear Dahlia products (brand_id = 11)
(130, 'Phấn Nước Dear Dahlia Skin Paradise Blooming Cushion 14g', 'phan-nuoc-dear-dahlia-skin-paradise-blooming-cushion-14g',
'Công dụng chính: Che phủ khuyết điểm, mang lại làn da mịn màng tự nhiên với độ bóng nhẹ.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Chiết xuất hoa thược dược, tinh chất dưỡng ẩm.',
8, 11, 'ACTIVE', NOW(), NOW()),

(131, 'Son Môi Dear Dahlia Paradise Dream Velvet Lip Mousse 3g', 'son-moi-dear-dahlia-paradise-dream-velvet-lip-mousse-3g',
'Công dụng chính: Bám môi lâu trôi, lên màu chuẩn với chất son mịn mượt như nhung.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Chiết xuất hoa thược dược, dầu jojoba.',
9, 11, 'ACTIVE', NOW(), NOW()),

(132, 'Phấn Phủ Dear Dahlia Skin Paradise Sheer Silk Pact 9g', 'phan-phu-dear-dahlia-skin-paradise-sheer-silk-pact-9g',
'Công dụng chính: Kiềm dầu, giữ lớp makeup lâu trôi và mang lại làn da mịn lì suốt cả ngày.
Loại da phù hợp: Mọi loại da, đặc biệt da dầu.
Thành phần chính: Bột lụa, chiết xuất hoa thược dược.',
8, 11, 'ACTIVE', NOW(), NOW()),

-- Clio products (brand_id = 13)
(133, 'Phấn Nước Clio Kill Cover The New Founwear Cushion 15g', 'phan-nuoc-clio-kill-cover-the-new-founwear-cushion-15g',
'Công dụng chính: Che phủ hoàn hảo các khuyết điểm, mang lại làn da mịn mượt với độ bền cao.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Cover & Fit Complex, Mesh Cover Powder.',
8, 13, 'ACTIVE', NOW(), NOW()),

(134, 'Kem Nền Clio Kill Cover Fixer Cushion 15g', 'kem-nen-clio-kill-cover-fixer-cushion-15g',
'Công dụng chính: Trang điểm da, che khuyết điểm và giữ makeup cả ngày dài không lo trôi.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Cover Fix Powder, Super Fitting Oil.',
8, 13, 'ACTIVE', NOW(), NOW()),

(135, 'Chì Kẻ Mày Clio Kill Brow Auto Hard Brow Pencil 0.31g', 'chi-ke-may-clio-kill-brow-auto-hard-brow-pencil-0-31g',
'Công dụng chính: Kẻ mày tự nhiên, bền màu cả ngày với đầu chì siêu mảnh.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Candelilla Wax, Caprylic/Capric Triglyceride.',
8, 13, 'ACTIVE', NOW(), NOW()),

(136, 'Bút Kẻ Mắt Clio Sharp So Simple Waterproof Pen Liner 0.6ml', 'but-ke-mat-clio-sharp-so-simple-waterproof-pen-liner-0-6ml',
'Công dụng chính: Kẻ mắt nước chống nước, bền màu cả ngày với đường kẻ sắc nét.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Film-forming Polymer, Màu khoáng.',
8, 13, 'ACTIVE', NOW(), NOW()),

(137, 'Mascara Clio Kill Lash Superproof Mascara 7g', 'mascara-clio-kill-lash-superproof-mascara-7g',
'Công dụng chính: Làm dày, dài mi và giữ cong mi cả ngày mà không bị vón cục.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Super Film Complex, Fiber Tube.',
8, 13, 'ACTIVE', NOW(), NOW()),

-- La Roche-Posay products (brand_id = 17)
(138, 'Sữa Rửa Mặt La Roche-Posay Effaclar Purifying Foaming Gel 400ml', 'sua-rua-mat-la-roche-posay-effaclar-purifying-foaming-gel-400ml',
'Công dụng chính: Làm sạch sâu, kiểm soát dầu nhờn và giảm mụn nhẹ cho da dầu mụn.
Loại da phù hợp: Da dầu, da mụn.
Thành phần chính: Zinc Pidolate, Thermal Spring Water.',
2, 17, 'ACTIVE', NOW(), NOW()),

(139, 'Kem Chống Nắng La Roche-Posay Anthelios UV Mune 400 Oil Control Gel Cream SPF50+ 50ml', 'kem-chong-nang-la-roche-posay-anthelios-uv-mune-400-oil-control-gel-cream-spf50-50ml',
'Công dụng chính: Bảo vệ da khỏi tia UVA, UVB và ánh sáng xanh, kiểm soát dầu nhờn hiệu quả.
Loại da phù hợp: Da dầu, da hỗn hợp.
Thành phần chính: Mexoryl 400, Niacinamide, Thermal Spring Water.',
7, 17, 'ACTIVE', NOW(), NOW()),

(140, 'Serum La Roche-Posay Pure Niacinamide 10 Serum 30ml', 'serum-la-roche-posay-pure-niacinamide-10-serum-30ml',
'Công dụng chính: Giảm thâm mụn, mờ nám và đều màu da với nồng độ Niacinamide 10%.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Niacinamide 10%, HEPES, Thermal Spring Water.',
4, 17, 'ACTIVE', NOW(), NOW()),

(141, 'Kem Dưỡng Ẩm La Roche-Posay Cicaplast Baume B5+ 40ml', 'kem-duong-am-la-roche-posay-cicaplast-baume-b5-40ml',
'Công dụng chính: Phục hồi da, làm dịu và cấp ẩm cho da kích ứng, tổn thương.
Loại da phù hợp: Mọi loại da, đặc biệt da nhạy cảm, kích ứng.
Thành phần chính: Panthenol (B5), Madecassoside, Zinc.',
5, 17, 'ACTIVE', NOW(), NOW()),

(142, 'Nước Tẩy Trang La Roche-Posay Micellar Water Ultra For Sensitive Skin 400ml', 'nuoc-tay-trang-la-roche-posay-micellar-water-ultra-for-sensitive-skin-400ml',
'Công dụng chính: Làm sạch da, tẩy trang dịu nhẹ không gây kích ứng cho da nhạy cảm.
Loại da phù hợp: Mọi loại da, đặc biệt da nhạy cảm.
Thành phần chính: Glycerin, Thermal Spring Water.',
3, 17, 'ACTIVE', NOW(), NOW()),

-- Obagi products (brand_id = 19)
(143, 'Serum Vitamin C Obagi Professional-C Serum 10% 30ml', 'serum-vitamin-c-obagi-professional-c-serum-10-30ml',
'Công dụng chính: Chống oxy hóa, làm sáng da và giảm nếp nhăn với Vitamin C tinh khiết.
Loại da phù hợp: Mọi loại da, đặc biệt da lão hóa.
Thành phần chính: L-Ascorbic Acid 10%, Hyaluronic Acid.',
4, 19, 'ACTIVE', NOW(), NOW()),

(144, 'Kem Dưỡng Ẩm Obagi Hydrate Facial Moisturizer 48g', 'kem-duong-am-obagi-hydrate-facial-moisturizer-48g',
'Công dụng chính: Cấp ẩm sâu, duy trì độ ẩm và bảo vệ hàng rào da suốt 8 giờ.
Loại da phù hợp: Mọi loại da, đặc biệt da khô.
Thành phần chính: Hydromanil, Shea Butter, Avocado Oil.',
5, 19, 'ACTIVE', NOW(), NOW()),

(145, 'Sữa Rửa Mặt Obagi Nu-Derm Gentle Cleanser 198ml', 'sua-rua-mat-obagi-nu-derm-gentle-cleanser-198ml',
'Công dụng chính: Làm sạch nhẹ nhàng, loại bỏ bụi bẩn và dầu thừa mà không làm khô da.
Loại da phù hợp: Da thường đến khô.
Thành phần chính: Aloe Vera, Panthenol, Allantoin.',
2, 19, 'ACTIVE', NOW(), NOW()),

(146, 'Toner Obagi Nu-Derm Toner 198ml', 'toner-obagi-nu-derm-toner-198ml',
'Công dụng chính: Cân bằng pH da, làm sạch sâu và chuẩn bị da cho các bước dưỡng tiếp theo.
Loại da phù hợp: Da thường đến dầu.
Thành phần chính: Witch Hazel, Aloe Vera.',
3, 19, 'ACTIVE', NOW(), NOW()),

-- Ohui products (brand_id = 21)
(147, 'Nước Hoa Hồng Ohui Prime Advancer Ampoule Skin Softener 150ml', 'nuoc-hoa-hong-ohui-prime-advancer-ampoule-skin-softener-150ml',
'Công dụng chính: Cấp ẩm, làm mềm da và chuẩn bị da cho các bước dưỡng tiếp theo.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Stem Cell Complex, Hyaluronic Acid.',
3, 21, 'ACTIVE', NOW(), NOW()),

(148, 'Sữa Dưỡng Da Ohui Prime Advancer Ampoule Emulsion 130ml', 'sua-duong-da-ohui-prime-advancer-ampoule-emulsion-130ml',
'Công dụng chính: Cấp ẩm, dưỡng da và ngăn ngừa lão hóa với công thức tiên tiến.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Stem Cell Complex, Collagen.',
5, 21, 'ACTIVE', NOW(), NOW()),

(149, 'Kem Dưỡng Ohui Prime Advancer Ampoule Cream 50ml', 'kem-duong-ohui-prime-advancer-ampoule-cream-50ml',
'Công dụng chính: Cấp ẩm sâu, chống lão hóa và tăng độ đàn hồi cho da.
Loại da phù hợp: Mọi loại da, đặc biệt da lão hóa.
Thành phần chính: Stem Cell Complex, Peptide, Collagen.',
5, 21, 'ACTIVE', NOW(), NOW()),

(150, 'Serum Ohui Prime Advancer Ampoule Serum 50ml', 'serum-ohui-prime-advancer-ampoule-serum-50ml',
'Công dụng chính: Dưỡng ẩm sâu, chống lão hóa và tái tạo làn da từ bên trong.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Stem Cell Complex, Vitamin Complex.',
4, 21, 'ACTIVE', NOW(), NOW()),

(151, 'Kem Chống Nắng Ohui Day Shield Perfect Sun Pro SPF50+ PA++++ 50ml', 'kem-chong-nang-ohui-day-shield-perfect-sun-pro-spf50-pa-50ml',
'Công dụng chính: Bảo vệ da khỏi tia UV, chống oxy hóa và dưỡng ẩm cho da.
Loại da phù hợp: Mọi loại da.
Thành phần chính: UV Filter Complex, Vitamin E.',
7, 21, 'ACTIVE', NOW(), NOW()),

(152, 'Sữa Rửa Mặt Ohui Miracle Moisture Cleansing Foam 200ml', 'sua-rua-mat-ohui-miracle-moisture-cleansing-foam-200ml',
'Công dụng chính: Làm sạch sâu, dưỡng ẩm và mang lại làn da mềm mại sau khi rửa.
Loại da phù hợp: Mọi loại da.
Thành phần chính: Hyaluronic Acid, Glycerin.',
2, 21, 'ACTIVE', NOW(), NOW())

ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    description = VALUES(description),
    status = VALUES(status),
    updated_at = NOW();

-- =====================================================
-- PRODUCT VARIANTS (for products 121-152)
-- =====================================================
INSERT INTO product_variants (id, product_id, name, sku, price, sale_price, stock_quantity, created_at, updated_at) VALUES
-- CNP Laboratory variants
(1022, 121, 'Toner CNP Vita-B Energy 200ml', '11108501', 680000.00, NULL, 15, NOW(), NOW()),
(1023, 122, 'Serum CNP Propolis Energy 15ml', '11108505', 540000.00, 459000.00, 12, NOW(), NOW()),
(1024, 123, 'Kem Dưỡng CNP Propolis Oil In Cream 50ml', '11108509', 720000.00, NULL, 10, NOW(), NOW()),
(1025, 124, 'Mặt Nạ CNP Propolis Energy 5 Miếng', '11108513', 450000.00, NULL, 20, NOW(), NOW()),

-- Cocoon variants
(1026, 125, 'Tẩy Trang Cocoon Bí Đao 500ml', '11109101', 240000.00, NULL, 25, NOW(), NOW()),
(1027, 126, 'Sữa Rửa Mặt Cocoon Dừa 140ml', '11109105', 159000.00, NULL, 20, NOW(), NOW()),
(1028, 127, 'Toner Cocoon Hoa Hồng 310ml', '11109109', 225000.00, NULL, 18, NOW(), NOW()),
(1029, 128, 'Serum Cocoon Vitamin C 30ml', '11109113', 350000.00, 297500.00, 15, NOW(), NOW()),
(1030, 129, 'Kem Mắt Cocoon Cà Phê 15ml', '11109117', 195000.00, NULL, 12, NOW(), NOW()),

-- Dear Dahlia variants (nhiều màu)
(1031, 130, 'Cushion Dear Dahlia #21 Fair Porcelain', '11110201', 1200000.00, NULL, 8, NOW(), NOW()),
(1032, 130, 'Cushion Dear Dahlia #23 Natural Beige', '11110202', 1200000.00, NULL, 10, NOW(), NOW()),
(1033, 131, 'Son Dear Dahlia #804 Modern Rose', '11110211', 680000.00, NULL, 15, NOW(), NOW()),
(1034, 131, 'Son Dear Dahlia #808 Fig Velvet', '11110212', 680000.00, NULL, 12, NOW(), NOW()),
(1035, 132, 'Phấn Phủ Dear Dahlia #01 Pink Beige', '11110221', 950000.00, NULL, 8, NOW(), NOW()),

-- Clio variants (nhiều màu)
(1036, 133, 'Cushion Clio Kill Cover #02 Lingerie', '11107301', 600000.00, NULL, 20, NOW(), NOW()),
(1037, 133, 'Cushion Clio Kill Cover #03 Linen', '11107302', 600000.00, NULL, 18, NOW(), NOW()),
(1038, 133, 'Cushion Clio Kill Cover #04 Ginger', '11107303', 600000.00, NULL, 15, NOW(), NOW()),
(1039, 134, 'Cushion Clio Fixer #02 Lingerie', '11107311', 650000.00, NULL, 12, NOW(), NOW()),
(1040, 135, 'Chì Mày Clio #01 Natural Brown', '11107321', 220000.00, NULL, 25, NOW(), NOW()),
(1041, 135, 'Chì Mày Clio #02 Light Brown', '11107322', 220000.00, NULL, 20, NOW(), NOW()),
(1042, 136, 'Kẻ Mắt Clio #01 Black', '11107331', 280000.00, NULL, 22, NOW(), NOW()),
(1043, 137, 'Mascara Clio #01 Long Curl', '11107341', 340000.00, NULL, 18, NOW(), NOW()),

-- La Roche-Posay variants
(1044, 138, 'Sữa Rửa Mặt LRP Effaclar 400ml', '11106101', 550000.00, NULL, 15, NOW(), NOW()),
(1045, 138, 'Sữa Rửa Mặt LRP Effaclar 200ml', '11106102', 350000.00, NULL, 20, NOW(), NOW()),
(1046, 139, 'Chống Nắng LRP UV Mune 400 50ml', '11106111', 540000.00, 459000.00, 18, NOW(), NOW()),
(1047, 140, 'Serum LRP Niacinamide 10 30ml', '11106121', 890000.00, NULL, 12, NOW(), NOW()),
(1048, 141, 'Kem Dưỡng LRP Cicaplast B5+ 40ml', '11106131', 350000.00, NULL, 25, NOW(), NOW()),
(1049, 141, 'Kem Dưỡng LRP Cicaplast B5+ 100ml', '11106132', 550000.00, NULL, 15, NOW(), NOW()),
(1050, 142, 'Tẩy Trang LRP Micellar 400ml', '11106141', 450000.00, NULL, 20, NOW(), NOW()),

-- Obagi variants
(1051, 143, 'Serum Obagi Vitamin C 10% 30ml', '11105501', 1580000.00, NULL, 8, NOW(), NOW()),
(1052, 143, 'Serum Obagi Vitamin C 15% 30ml', '11105502', 1880000.00, NULL, 6, NOW(), NOW()),
(1053, 143, 'Serum Obagi Vitamin C 20% 30ml', '11105503', 2180000.00, NULL, 5, NOW(), NOW()),
(1054, 144, 'Kem Dưỡng Obagi Hydrate 48g', '11105511', 1200000.00, NULL, 10, NOW(), NOW()),
(1055, 145, 'Sữa Rửa Mặt Obagi Gentle 198ml', '11105521', 850000.00, NULL, 12, NOW(), NOW()),
(1056, 146, 'Toner Obagi Nu-Derm 198ml', '11105531', 750000.00, NULL, 10, NOW(), NOW()),

-- Ohui variants
(1057, 147, 'Toner Ohui Prime Advancer 150ml', '11104501', 1100000.00, NULL, 10, NOW(), NOW()),
(1058, 148, 'Sữa Dưỡng Ohui Prime Advancer 130ml', '11104511', 1150000.00, NULL, 10, NOW(), NOW()),
(1059, 149, 'Kem Dưỡng Ohui Prime Advancer 50ml', '11104521', 1800000.00, NULL, 8, NOW(), NOW()),
(1060, 150, 'Serum Ohui Prime Advancer 50ml', '11104531', 1650000.00, NULL, 8, NOW(), NOW()),
(1061, 151, 'Chống Nắng Ohui Day Shield 50ml', '11104541', 890000.00, NULL, 12, NOW(), NOW()),
(1062, 152, 'Sữa Rửa Mặt Ohui Miracle 200ml', '11104551', 650000.00, NULL, 15, NOW(), NOW())

ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    price = VALUES(price),
    sale_price = VALUES(sale_price),
    stock_quantity = VALUES(stock_quantity),
    updated_at = NOW();

-- =====================================================
-- PRODUCT IMAGES (for products 121-152)
-- =====================================================
INSERT INTO product_images (product_id, image_url) VALUES
-- CNP Laboratory images
(121, 'https://image.hsv-tech.io/bbx/common/cnp-vitab-toner-1.webp'),
(121, 'https://image.hsv-tech.io/bbx/common/cnp-vitab-toner-2.webp'),
(122, 'https://image.hsv-tech.io/bbx/common/cnp-propolis-serum-1.webp'),
(122, 'https://image.hsv-tech.io/bbx/common/cnp-propolis-serum-2.webp'),
(123, 'https://image.hsv-tech.io/bbx/common/cnp-propolis-cream-1.webp'),
(123, 'https://image.hsv-tech.io/bbx/common/cnp-propolis-cream-2.webp'),
(124, 'https://image.hsv-tech.io/bbx/common/cnp-propolis-mask-1.webp'),
(124, 'https://image.hsv-tech.io/bbx/common/cnp-propolis-mask-2.webp'),

-- Cocoon images
(125, 'https://image.hsv-tech.io/bbx/common/cocoon-micellar-1.webp'),
(125, 'https://image.hsv-tech.io/bbx/common/cocoon-micellar-2.webp'),
(126, 'https://image.hsv-tech.io/bbx/common/cocoon-cleanser-1.webp'),
(126, 'https://image.hsv-tech.io/bbx/common/cocoon-cleanser-2.webp'),
(127, 'https://image.hsv-tech.io/bbx/common/cocoon-toner-1.webp'),
(127, 'https://image.hsv-tech.io/bbx/common/cocoon-toner-2.webp'),
(128, 'https://image.hsv-tech.io/bbx/common/cocoon-vitc-1.webp'),
(128, 'https://image.hsv-tech.io/bbx/common/cocoon-vitc-2.webp'),
(129, 'https://image.hsv-tech.io/bbx/common/cocoon-eyecream-1.webp'),
(129, 'https://image.hsv-tech.io/bbx/common/cocoon-eyecream-2.webp'),

-- Dear Dahlia images
(130, 'https://image.hsv-tech.io/bbx/common/dahlia-cushion-1.webp'),
(130, 'https://image.hsv-tech.io/bbx/common/dahlia-cushion-2.webp'),
(131, 'https://image.hsv-tech.io/bbx/common/dahlia-lip-1.webp'),
(131, 'https://image.hsv-tech.io/bbx/common/dahlia-lip-2.webp'),
(132, 'https://image.hsv-tech.io/bbx/common/dahlia-powder-1.webp'),
(132, 'https://image.hsv-tech.io/bbx/common/dahlia-powder-2.webp'),

-- Clio images
(133, 'https://image.hsv-tech.io/bbx/common/clio-cushion-1.webp'),
(133, 'https://image.hsv-tech.io/bbx/common/clio-cushion-2.webp'),
(134, 'https://image.hsv-tech.io/bbx/common/clio-fixer-1.webp'),
(134, 'https://image.hsv-tech.io/bbx/common/clio-fixer-2.webp'),
(135, 'https://image.hsv-tech.io/bbx/common/clio-brow-1.webp'),
(135, 'https://image.hsv-tech.io/bbx/common/clio-brow-2.webp'),
(136, 'https://image.hsv-tech.io/bbx/common/clio-liner-1.webp'),
(136, 'https://image.hsv-tech.io/bbx/common/clio-liner-2.webp'),
(137, 'https://image.hsv-tech.io/bbx/common/clio-mascara-1.webp'),
(137, 'https://image.hsv-tech.io/bbx/common/clio-mascara-2.webp'),

-- La Roche-Posay images
(138, 'https://image.hsv-tech.io/bbx/common/lrp-effaclar-1.webp'),
(138, 'https://image.hsv-tech.io/bbx/common/lrp-effaclar-2.webp'),
(139, 'https://image.hsv-tech.io/bbx/common/lrp-sunscreen-1.webp'),
(139, 'https://image.hsv-tech.io/bbx/common/lrp-sunscreen-2.webp'),
(140, 'https://image.hsv-tech.io/bbx/common/lrp-niacinamide-1.webp'),
(140, 'https://image.hsv-tech.io/bbx/common/lrp-niacinamide-2.webp'),
(141, 'https://image.hsv-tech.io/bbx/common/lrp-cicaplast-1.webp'),
(141, 'https://image.hsv-tech.io/bbx/common/lrp-cicaplast-2.webp'),
(142, 'https://image.hsv-tech.io/bbx/common/lrp-micellar-1.webp'),
(142, 'https://image.hsv-tech.io/bbx/common/lrp-micellar-2.webp'),

-- Obagi images
(143, 'https://image.hsv-tech.io/bbx/common/obagi-vitc-1.webp'),
(143, 'https://image.hsv-tech.io/bbx/common/obagi-vitc-2.webp'),
(144, 'https://image.hsv-tech.io/bbx/common/obagi-hydrate-1.webp'),
(144, 'https://image.hsv-tech.io/bbx/common/obagi-hydrate-2.webp'),
(145, 'https://image.hsv-tech.io/bbx/common/obagi-cleanser-1.webp'),
(145, 'https://image.hsv-tech.io/bbx/common/obagi-cleanser-2.webp'),
(146, 'https://image.hsv-tech.io/bbx/common/obagi-toner-1.webp'),
(146, 'https://image.hsv-tech.io/bbx/common/obagi-toner-2.webp'),

-- Ohui images
(147, 'https://image.hsv-tech.io/bbx/common/ohui-toner-1.webp'),
(147, 'https://image.hsv-tech.io/bbx/common/ohui-toner-2.webp'),
(148, 'https://image.hsv-tech.io/bbx/common/ohui-emulsion-1.webp'),
(148, 'https://image.hsv-tech.io/bbx/common/ohui-emulsion-2.webp'),
(149, 'https://image.hsv-tech.io/bbx/common/ohui-cream-1.webp'),
(149, 'https://image.hsv-tech.io/bbx/common/ohui-cream-2.webp'),
(150, 'https://image.hsv-tech.io/bbx/common/ohui-serum-1.webp'),
(150, 'https://image.hsv-tech.io/bbx/common/ohui-serum-2.webp'),
(151, 'https://image.hsv-tech.io/bbx/common/ohui-sunscreen-1.webp'),
(151, 'https://image.hsv-tech.io/bbx/common/ohui-sunscreen-2.webp'),
(152, 'https://image.hsv-tech.io/bbx/common/ohui-cleanser-1.webp'),
(152, 'https://image.hsv-tech.io/bbx/common/ohui-cleanser-2.webp');
