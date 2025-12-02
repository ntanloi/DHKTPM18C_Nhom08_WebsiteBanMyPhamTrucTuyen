-- V11: Seed products from BeautyBox scraper data (Part 1: Products 1-20)
-- Products from Aestura, AHC, Avene, Beyond, Bioderma brands

-- =====================================================
-- PRODUCTS
-- =====================================================
INSERT INTO products (id, name, slug, description, category_id, brand_id, status, created_at, updated_at) VALUES

-- Aestura products (brand_id = 2)
(101, 'Kem Dưỡng Da Chuyên Sâu Aestura Atobarrier365 Cream 80ml', 'kem-duong-da-chuyen-sau-aestura-atobarrier-365-cream-80ml', 
'Công dụng chính: Bổ sung độ ẩm chuyển sâu lên đến 100 giờ giúp làn da luôn căng mọng, giảm thiểu sự bong tróc, khô sần mang lại làn da ẩm mượt tràn đầy sức sống.
Thành phần chính: Niacinamide, chiết xuất trà xanh.
Loại da phù hợp: Mọi loại da, đặc biệt là da khô sần, thiếu nước.', 
5, 2, 'ACTIVE', NOW(), NOW()),

(102, 'Sữa Dưỡng Da Aestura Atobarrier365 Lotion 150ml', 'sua-duong-da-mem-mai-aestura-atobarrier-365-lotion-150ml',
'Công dụng chính: Cấp ẩm, dưỡng sáng và tăng cường sức đề kháng giúp làn da khỏe mạnh, tránh khỏi nứt nẻ, khô sần.
Thành phần chính: Niacinamide, chiết xuất trà xanh.
Loại da phù hợp: Mọi loại da, kể cả làn da nhạy cảm.',
5, 2, 'ACTIVE', NOW(), NOW()),

(103, 'Nước Cân Bằng Cấp Ẩm Aestura Theracne 365 Hydration Toner 150ml', 'nuoc-can-bang-cap-am-aestura-theracne-365-hydration-toner-150ml',
'Công dụng chính: Cấp ẩm vượt trội, cân bằng lượng dầu và nước giúp da luôn căng bóng, mềm mại suốt nhiều giờ liền.
Thành phần chính: Chiết xuất trà xanh, Niacinamide.
Loại da phù hợp: Mọi loại da, kể cả da nhạy cảm.',
3, 2, 'ACTIVE', NOW(), NOW()),

(104, 'Sữa Rửa Mặt Dưỡng Da Dạng Bọt Aestura Atobarrier 365 Bubble Cleanser 150ml', 'sua-rua-mat-duong-da-dang-bot-aestura-atobarrier-365-bubble-cleanser-150ml',
'Công dụng chính: Làm sạch, loại bỏ bụi bẩn ẩn sâu bên trong lỗ chân lông, nhẹ nhàng lấy đi vi khuẩn mang lại làn da khỏe, sáng như mong muốn.
Thành phần chính: Niacinamide, chiết xuất trà xanh.
Loại da phù hợp: Mọi loại da, kể cả da nhạy cảm.',
2, 2, 'ACTIVE', NOW(), NOW()),

-- AHC products (brand_id = 3)
(105, 'Kem Dưỡng Mắt Ahc Age Defense Real Eye Cream For Face 40Ml', 'kem-duong-mat-ahc-age-defense-real-eye-cream-for-face-40ml',
'Công dụng chính: Kem dưỡng mắt AHC với thành phần chính từ phức hợp tinh thể vàng giúp chăm sóc nếp nhăn, duy trì vùng da mắt tươi sáng và căng mịn.
Thành phần chính: Phức hợp tinh thể vàng.
Loại da sử dụng tốt nhất: Vùng da mắt lão hóa, có nếp nhăn.
Hiệu quả sử dụng: Làm giảm nếp nhăn 55% sau 4 tuần sử dụng, nâng cơ làm săn chắc và ẩm mượt da rõ rệt.',
5, 3, 'ACTIVE', NOW(), NOW()),

(106, 'Kem Dưỡng Ngừa Lão Hóa Ahc Youth Focus Cream 50Ml', 'kem-duong-chong-lao-hoa-ahc-youth-focus-cream-50ml',
'Công dụng chính: Kem dưỡng AHC Youth Focus cấp ẩm & duy trì độ ẩm cho da, làm mịn các nếp nhăn đồng thời làm tăng độ săn chắc cho da.
Thành phần chính: Retinal.
Loại da sử dụng tốt nhất: Da lão hóa, có nếp nhăn.',
5, 3, 'ACTIVE', NOW(), NOW()),

(107, 'Kem Chống Nắng Dịu Nhẹ Da AHC Safe On Essence Sun Cream SPF50+ PA++++ 50ml', 'kem-chong-nang-diu-nhe-da-ahc-safe-on-essence-sun-cream-spf50-pa-50ml',
'Công dụng chính: Kem chống nắng AHC dịu nhẹ dùng hàng ngày với sự góp mặt của rau má dành cho da nhạy cảm. Thích hợp cho các hoạt động ngoài trời.
Thành phần chính: Rau má, Zinc Oxide, Niacinamide.
Loại da sử dụng tốt nhất: Mọi loại da.',
7, 3, 'ACTIVE', NOW(), NOW()),

(108, 'Sữa Rửa Mặt Cấp Ẩm Ahc Premium Ex Hydra B5 Soothing Foam 180Ml', 'sua-rua-mat-cap-am-ahc-premium-ex-hydra-b5-soothing-foam-180ml',
'Công dụng chính: Sữa rửa mặt AHC Premium Ex Hydra B5 giúp làm sạch sâu, đồng thời duy trì độ ẩm cho da mềm mượt sau khi rửa.
Thành phần chính: Derma Hyaluronic acid và D-Panthenol.
Loại da sử dụng tốt nhất: Da khô bong tróc, có nếp nhăn li ti.',
2, 3, 'ACTIVE', NOW(), NOW()),

-- Avene products (brand_id = 5)
(109, 'Nước Xịt Khoáng Avene Làm Dịu & Giảm Kích Ứng Da Thermal Spring Water 50ml', 'nuoc-xit-khoang-avene-lam-diu-giam-kich-ung-da-thermal-spring-water-50ml',
'Xịt Khoáng Avene Thermal Spring Water giúp làm dịu, giảm kích ứng da cho da nhạy cảm đồng thời cấp ẩm tức thời, mang lại cảm giác thoải mái, nhẹ nhàng cho làn da đang khát nước.
Thành phần chính: 100% Nước khoáng Eau Thermal Avene.',
1, 5, 'ACTIVE', NOW(), NOW()),

(110, 'Sữa Chống Nắng Avene Cho Da Dầu Mụn Cleanance Protect 50+ 50ml', 'sua-chong-nang-avene-cho-da-dau-mun-cleanance-protect-50-50ml',
'Đối tượng sử dụng: Da dầu, Da mụn, nhạy cảm.
Sản phẩm có màng quang phổ rộng có hệ thống màng lọc được cấp bằng sáng chế giúp lọc 4 loại tia từ ánh nắng gồm UVA, UVB, UVC, Hev Blue Light đem lại hiệu quả chống nắng cao, toàn diện.',
7, 5, 'ACTIVE', NOW(), NOW()),

-- Beyond products (brand_id = 6)
(111, 'Kem Dưỡng Ẩm Cho Da Khô Beyond Angel Aqua Moisture Barrier Cream 150ml', 'kem-duong-am-chuyen-sau-cho-da-kho-beyond-angel-aqua-moisture-barrier-cream-150ml',
'Kem dưỡng cấp giữ ẩm sâu cho da, duy trì độ ẩm tại các tầng biểu bì đến 100h.
Phục hồi độ ẩm và xây dựng màng lipid khỏe khoắn.
Thành phần: Phức hợp Tri-Sap Complex, Panthenol, 5 loại Hyaluronic acid.',
5, 6, 'ACTIVE', NOW(), NOW()),

(112, 'Sữa Rửa Mặt Beyond Phytoganic Facial Foam 200ml Phục Hồi Da', 'sua-rua-mat-phuc-hoi-sinh-khi-lan-da-beyond-phytoganic-facial-foam-200ml',
'Làm sạch bụi bẩn & dầu thừa trên da.
Cải thiện vẻ mệt mỏi & phục hồi độ ẩm cho da.
Công thức Phyto-biome giúp củng cố hàng rào bảo vệ da, tạo nền da sạch khỏe.',
2, 6, 'ACTIVE', NOW(), NOW()),

-- Bioderma products (brand_id = 7)
(113, 'Nước tẩy trang Bioderma Sensibio H2O Hồng Cho Da Nhạy Cảm 500Ml', 'dung-dich-lam-sach-va-tay-trang-cho-da-nhay-cam-bioderma-sensibio-h2o-500ml',
'Công dụng chính: Làm sạch sâu loại bỏ bụi bẩn, lớp trang điểm giúp lỗ chân lông thông thoáng, hạn chế mụn viêm.
Loại da phù hợp: Mọi loại da, đặc biệt là da nhạy cảm.
Thành phần chính: Chiết xuất từ thành phần thiên nhiên như lô hội, dưa chuột, trà xanh.',
3, 7, 'ACTIVE', NOW(), NOW()),

(114, 'Nước Tẩy Trang Bioderma Sebium H2O Xanh Lá Cho Da Hỗn Hợp Và Da Dầu 500Ml', 'dung-dich-lam-sach-tay-trang-cho-da-hon-hop-va-da-dau-bioderma-sebium-h2o-500ml',
'Công dụng chính: Làm sạch bụi bẩn, dầu thừa và cặn bã lớp trang điểm giúp kháng khuẩn, ngăn bít tắc lỗ chân lông.
Loại da phù hợp: Da hỗn hợp và da dầu.
Thành phần chính: Chiết xuất dưa chuột, trái cây.',
3, 7, 'ACTIVE', NOW(), NOW()),

(115, 'Sữa Rửa Mặt Giảm Mụn Bioderma Sebium Gel Moussant Actif 200ml', 'sua-rua-mat-giam-mun-bioderma-sebium-gel-moussant-actif-200ml',
'Sữa rửa mặt Bioderma Sebium Gel Moussant Actif không chỉ làm sạch sâu, giảm tiết dầu thừa ở da, mà còn giúp giảm thiểu mụn và ngừa chúng quay trở lại.
Nhẹ nhàng làm sạch bụi bẩn, dầu thừa và cặn trang điểm.',
2, 7, 'ACTIVE', NOW(), NOW()),

(116, 'Sữa Rửa Mặt Tạo Bọt Cho Da Nhạy Cảm Bioderma Sensibio Gel Moussant 200ml', 'sua-rua-mat-tao-bot-cho-da-nhay-cam-bioderma-sensibio-gel-moussant-200ml',
'Công dụng chính: Làm sạch, loại bỏ bụi bẩn mang lại làn da mịn màng, không gây kích ứng.
Loại da phù hợp: Mọi loại da, đặc biệt là da mỏng, da nhạy cảm.
Thành phần chính: Chứa Coco Glucoside, phức hợp độc quyền D.A.F™.',
2, 7, 'ACTIVE', NOW(), NOW()),

(117, 'Gel Tẩy Tế Bào Chết Bioderma Sebium Gel Gommant 100Ml', 'gel-tay-te-bao-chet-lam-min-da-bioderma-sebium-gel-gommant-100ml',
'Công dụng chính: Loại bỏ mụn trứng cá, đầu đen, giảm bã nhờn và sáng da hiệu quả.
Loại da phù hợp: Dành cho da hỗn hợp, da nhờn, mụn.
Thành phần chính: Công thức Fluidactiv®, phức hợp D.A.F.',
2, 7, 'ACTIVE', NOW(), NOW()),

(118, 'Kem Dưỡng Giảm Mụn Chuyên Sâu Cho Da Mụn Nhẹ Đến Vừa Bioderma Sebium Global 30Ml', 'kem-duong-giam-mun-chuyen-sau-cho-da-mun-nhe-den-vua-bioderma-sebium-global-30ml',
'Công dụng chính: Loại bỏ các loại mụn đầu đen, mụn trứng cá từ nhẹ đến vừa, khắc phục tình trạng bóng dầu, dưỡng ẩm da hiệu quả.
Loại da phù hợp: Mọi loại da, đặc biệt là da mụn.
Thành phần chính: Công thức Fluidactiv®, AHA.',
5, 7, 'ACTIVE', NOW(), NOW()),

(119, 'Kem Dưỡng Ẩm Làm Dịu Da Nhạy Cảm Bioderma Sensibio Light 40Ml', 'kem-duong-am-lam-diu-da-nhay-cam-bioderma-sensibio-light-40ml',
'Công dụng chính: Có tác dụng làm dịu, giảm kích ứng, có thể sử dụng như kem lót trang điểm.
Loại da phù hợp: Mọi loại da, đặc biệt là da nhạy cảm.
Thành phần chính: Glycerin, Cetearyl isononanoate, chiết xuất cây cam thảo.',
5, 7, 'ACTIVE', NOW(), NOW()),

(120, 'Kem Dưỡng Se Nhỏ Lỗ Chân Lông Cho Da Hỗn Hợp Và Da Dầu Bioderma Sebium Pore Refiner 30Ml', 'kem-duong-se-nho-lo-chan-long-cho-da-hon-hop-va-da-dau-bioderma-sebium-pore-refiner-30ml',
'Công dụng chính: Hỗ trợ se khít lỗ chân lông, cải thiện làn da sần sùi, ngăn ngừa tình trạng mụn.
Loại da phù hợp: Mọi loại da, đặc biệt là da hỗn hợp và da dầu.
Thành phần chính: Chiết xuất lá bạch quả, nấm và tảo biển.',
5, 7, 'ACTIVE', NOW(), NOW())

ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    description = VALUES(description),
    status = VALUES(status),
    updated_at = NOW();

-- =====================================================
-- PRODUCT VARIANTS (for products 101-120)
-- =====================================================
INSERT INTO product_variants (id, product_id, name, sku, price, sale_price, stock_quantity, created_at, updated_at) VALUES
-- Aestura variants
(1001, 101, 'Kem Dưỡng Aestura Atobarrier365 Cream 80ml', '11110744', 600000.00, NULL, 10, NOW(), NOW()),
(1002, 102, 'Sữa Dưỡng Aestura Atobarrier365 Lotion 150ml', '11110747', 600000.00, NULL, 10, NOW(), NOW()),
(1003, 103, 'Toner Aestura Theracne 365 150ml', '11108719', 576000.00, NULL, 15, NOW(), NOW()),
(1004, 104, 'Sữa Rửa Mặt Aestura Atobarrier 365 150ml', '11108712', 480000.00, NULL, 20, NOW(), NOW()),

-- AHC variants
(1005, 105, 'Kem Mắt AHC Age Defense 40ml', '11104321', 840000.00, NULL, 8, NOW(), NOW()),
(1006, 106, 'Kem Dưỡng AHC Youth Focus 50ml', '11106817', 1248000.00, NULL, 5, NOW(), NOW()),
(1007, 107, 'Chống Nắng AHC Safe On SPF50+ 50ml', '11109804', 459800.00, NULL, 25, NOW(), NOW()),
(1008, 108, 'Sữa Rửa Mặt AHC Hydra B5 180ml', '11104322', 480000.00, NULL, 15, NOW(), NOW()),

-- Avene variants (product có nhiều variant)
(1009, 109, 'Xịt Khoáng Avene 50ml', '11110736', 194000.00, NULL, 30, NOW(), NOW()),
(1010, 109, 'Xịt Khoáng Avene 150ml', '11110734', 320000.00, NULL, 20, NOW(), NOW()),
(1011, 110, 'Chống Nắng Avene Cleanance 50ml', '11110740', 808000.00, NULL, 12, NOW(), NOW()),

-- Beyond variants
(1012, 111, 'Kem Dưỡng Beyond Angel Aqua 150ml', '11110496', 216000.00, NULL, 18, NOW(), NOW()),
(1013, 112, 'Sữa Rửa Mặt Beyond Phytoganic 200ml', '11109082', 436000.00, NULL, 15, NOW(), NOW()),

-- Bioderma variants
(1014, 113, 'Tẩy Trang Bioderma Sensibio 500ml', '11105724', 401250.00, NULL, 25, NOW(), NOW()),
(1015, 114, 'Tẩy Trang Bioderma Sebium 500ml', '11105733', 401250.00, NULL, 20, NOW(), NOW()),
(1016, 115, 'Sữa Rửa Mặt Bioderma Sebium Actif 200ml', '11110975', 380000.00, NULL, 18, NOW(), NOW()),
(1017, 116, 'Sữa Rửa Mặt Bioderma Sensibio 200ml', '11105726', 382500.00, NULL, 15, NOW(), NOW()),
(1018, 117, 'Tẩy TBC Bioderma Sebium 100ml', '11105737', 440000.00, NULL, 12, NOW(), NOW()),
(1019, 118, 'Kem Trị Mụn Bioderma Sebium Global 30ml', '11105741', 390000.00, NULL, 10, NOW(), NOW()),
(1020, 119, 'Kem Dưỡng Bioderma Sensibio Light 40ml', '11105729', 390000.00, NULL, 14, NOW(), NOW()),
(1021, 120, 'Kem Se Lỗ Chân Lông Bioderma 30ml', '11105739', 403750.00, NULL, 10, NOW(), NOW())

ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    price = VALUES(price),
    stock_quantity = VALUES(stock_quantity),
    updated_at = NOW();

-- =====================================================
-- PRODUCT IMAGES (for products 101-120)
-- =====================================================
INSERT INTO product_images (product_id, image_url) VALUES
-- Aestura images
(101, 'https://image.hsv-tech.io/bbx/common/1b3ea39a-e1f4-43c5-addd-8d434ba9bdf9.webp'),
(101, 'https://image.hsv-tech.io/bbx/common/36faf20a-91ce-4f75-86d4-3458cee34487.webp'),
(101, 'https://image.hsv-tech.io/bbx/common/7986c884-a471-4621-8e4d-6eb7af8ae45b.webp'),

(102, 'https://image.hsv-tech.io/bbx/common/32770cae-a156-4f84-a7df-4a1eef4ba261.webp'),
(102, 'https://image.hsv-tech.io/bbx/common/c8b5a529-8f46-4f56-b1d8-eca76a2d6c43.webp'),
(102, 'https://image.hsv-tech.io/bbx/common/d0e42dc9-3baa-4bfa-b01c-89cae988a1a6.webp'),

(103, 'https://image.hsv-tech.io/bbx/common/028ffac8-5369-4025-bece-cb7ddc1d596c.webp'),
(103, 'https://image.hsv-tech.io/bbx/common/1abc53fd-ddb3-4087-85d5-a51d2e0e6e6b.webp'),
(103, 'https://image.hsv-tech.io/bbx/common/3fe42f1c-d3b3-426f-8ca8-9db15d723688.webp'),

(104, 'https://image.hsv-tech.io/bbx/common/11c3a467-1af6-44a0-86d4-dafe54d7df46.webp'),
(104, 'https://image.hsv-tech.io/bbx/common/8c487585-70b7-4ff1-a2f3-9e75ec5a8429.webp'),
(104, 'https://image.hsv-tech.io/bbx/common/fae58479-f2c9-4726-b7ee-4cf804e3bbda.webp'),

-- AHC images
(105, 'https://image.hsv-tech.io/bbx/products/a1ca8078-2de7-4d34-83de-0d89d11a4e20.webp'),
(105, 'https://image.hsv-tech.io/bbx/common/2bad07dd-36ea-40b8-808c-47059ef1dfa3.webp'),
(105, 'https://image.hsv-tech.io/bbx/products/7f94c215-2ffe-4071-9c93-bec1fa931f6d.webp'),

(106, 'https://image.hsv-tech.io/bbx/products/24b56d39-d3f4-4a5c-b677-c237ae88de1d.webp'),
(106, 'https://image.hsv-tech.io/bbx/products/56ef5e4f-006e-43c4-b295-62c4ff7712b5.webp'),
(106, 'https://image.hsv-tech.io/bbx/common/1fc48edf-07a2-4a2f-ab08-e65ac60bed13.webp'),

(107, 'https://image.hsv-tech.io/bbx/common/1bdaf1f9-371d-466d-b1e9-e2100e0c4bb0.webp'),
(107, 'https://image.hsv-tech.io/bbx/common/617ffdde-f035-4a2c-9d7f-f373419d5a0a.webp'),
(107, 'https://image.hsv-tech.io/bbx/common/17337f4a-220f-4eb5-8af3-feecd1de0438.webp'),

(108, 'https://image.hsv-tech.io/bbx/products/4aae1e99-c811-46b5-a44a-3d87072126ef.webp'),
(108, 'https://image.hsv-tech.io/bbx/products/e997bcf8-6837-4020-8ca2-5dc935a506bd.webp'),
(108, 'https://image.hsv-tech.io/bbx/products/51f9c388-72d3-416d-b0b1-1945e42a2d4c.webp'),

-- Avene images
(109, 'https://image.hsv-tech.io/bbx/common/23701ae7-f8c1-45da-b997-3a7bac89f09b.webp'),
(109, 'https://image.hsv-tech.io/bbx/common/79ddd0ce-0760-4e23-abc2-8df24cbd39be.webp'),
(109, 'https://image.hsv-tech.io/bbx/common/eda95699-4200-4b5a-9695-bff879ec1584.webp'),

(110, 'https://image.hsv-tech.io/bbx/common/d0ce823c-6868-4990-bf02-02815de9f0d1.webp'),
(110, 'https://image.hsv-tech.io/bbx/common/91aad717-b243-4dd1-8fb7-5ba209d78af8.webp'),
(110, 'https://image.hsv-tech.io/bbx/common/cd3085bf-171f-4a6c-b559-d3f39240feec.webp'),

-- Beyond images
(111, 'https://image.hsv-tech.io/bbx/common/c5114e36-611d-4299-ab61-efc6b86b600b.webp'),
(111, 'https://image.hsv-tech.io/bbx/common/36cfb227-1e22-46b7-96b0-9d7e51caf216.webp'),
(111, 'https://image.hsv-tech.io/bbx/common/575d5144-5a0b-48c6-ba28-9a0a1ab1641d.webp'),

(112, 'https://image.hsv-tech.io/bbx/common/ed265a4a-56f3-480f-ac65-8add794731db.webp'),
(112, 'https://image.hsv-tech.io/bbx/common/6b259119-6607-4af1-9987-93be46a6926f.webp'),
(112, 'https://image.hsv-tech.io/bbx/common/0ed5e9b8-cbce-4589-8ee3-c68b112b2d6a.webp'),

-- Bioderma images
(113, 'https://image.hsv-tech.io/bbx/common/e036ddb1-2588-4390-bb58-ef7255b789aa.webp'),
(113, 'https://image.hsv-tech.io/bbx/common/8307c0fc-0c35-4e84-a210-ad30e92fe8ac.webp'),
(113, 'https://image.hsv-tech.io/bbx/common/f84b8bf9-6359-459b-9638-1ce863dcf43e.webp'),

(114, 'https://image.hsv-tech.io/bbx/common/b59f7943-8252-46c9-8aef-81c2fb5c92e1.webp'),
(114, 'https://image.hsv-tech.io/bbx/common/f880d877-c958-42b1-9067-db926c6e01c3.webp'),
(114, 'https://image.hsv-tech.io/bbx/common/e588980f-2813-4b25-b939-2f81a68262bf.webp'),

(115, 'https://image.hsv-tech.io/bbx/common/6e61405b-84c2-4ad8-b0eb-20e8a0a37a7d.webp'),
(115, 'https://image.hsv-tech.io/bbx/common/939d0735-245f-4fbf-9430-134a00785b07.webp'),
(115, 'https://image.hsv-tech.io/bbx/common/becb3504-6e54-4fe7-a631-910304d81cd0.webp'),

(116, 'https://image.hsv-tech.io/bbx/products/98e7a2fd-e5f2-4b75-a1d7-70233506442a.webp'),
(116, 'https://image.hsv-tech.io/bbx/products/81c462d4-5bcf-4c2c-9566-d35cf6ebb0fd.webp'),
(116, 'https://image.hsv-tech.io/bbx/products/e83431c8-a210-4bd1-baa4-af0985323ce7.webp'),

(117, 'https://image.hsv-tech.io/bbx/products/359e02a7-95d7-4a12-85d2-fe901a3e9f95.webp'),
(117, 'https://image.hsv-tech.io/bbx/products/2d69d2ad-2341-4028-9545-1d157413997d.webp'),
(117, 'https://image.hsv-tech.io/bbx/products/506b42b6-d0eb-4a59-8506-f6f7b1c242f7.webp'),

(118, 'https://image.hsv-tech.io/bbx/products/0e332c3f-b35c-41fb-b8ba-a79a7d72313e.webp'),
(118, 'https://image.hsv-tech.io/bbx/products/e98414c4-f5c8-4864-948c-bc8e0ea67c81.webp'),
(118, 'https://image.hsv-tech.io/bbx/products/3fc53792-6ce5-4b92-b143-968f369e0509.webp'),

(119, 'https://image.hsv-tech.io/bbx/products/c3af477b-6d58-4637-a9f1-29a80f98f96e.webp'),
(119, 'https://image.hsv-tech.io/bbx/products/5d792255-a658-47dd-9355-2bdc14a7ef8c.webp'),
(119, 'https://image.hsv-tech.io/bbx/products/f01c0670-8fdb-4300-b12b-a3bce3f10c34.webp'),

(120, 'https://image.hsv-tech.io/bbx/products/a226e69d-8ad3-41cf-8f92-c1bcd143a660.webp'),
(120, 'https://image.hsv-tech.io/bbx/products/defb9ac1-7396-4bc0-8a4f-60381434ac06.webp'),
(120, 'https://image.hsv-tech.io/bbx/products/2fde1e52-5f71-4da2-add0-ec581bb45c11.webp');
