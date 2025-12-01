-- V5: Create chat tables for customer support - Cosmetic E-commerce

-- Chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id VARCHAR(100) PRIMARY KEY,
    customer_id INT NOT NULL,
    manager_id INT,
    room_type ENUM('BOT', 'HUMAN') NOT NULL DEFAULT 'BOT',
    status ENUM('OPEN', 'PENDING', 'ASSIGNED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    subject VARCHAR(255),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closed_at DATETIME,
    
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_customer (customer_id),
    INDEX idx_manager (manager_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id VARCHAR(100) NOT NULL,
    sender_id INT,
    sender_type ENUM('CUSTOMER', 'MANAGER', 'BOT', 'SYSTEM') NOT NULL,
    content TEXT NOT NULL,
    message_type ENUM('TEXT', 'IMAGE', 'PRODUCT', 'QUICK_REPLY') DEFAULT 'TEXT',
    metadata JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_room (room_id),
    INDEX idx_created (created_at),
    INDEX idx_sender_type (sender_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAQ for bot responses - Cosmetic specific
CREATE TABLE IF NOT EXISTS chat_faq (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    keywords VARCHAR(500) NOT NULL,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    related_product_ids JSON,
    priority INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    FULLTEXT INDEX ft_search (keywords, question, answer)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert cosmetic-specific FAQs
INSERT INTO chat_faq (category, keywords, question, answer, priority) VALUES
-- Shipping & Delivery
('shipping', 'giao hàng, ship, vận chuyển, delivery, bao lâu, mấy ngày', 
 'Thời gian giao hàng bao lâu?', 
 'Thời gian giao hàng:\n• Nội thành HCM & Hà Nội: 1-2 ngày\n• Các tỉnh thành khác: 3-5 ngày\n• Vùng sâu vùng xa: 5-7 ngày\n\nĐơn hàng trên 500.000đ được MIỄN PHÍ vận chuyển! 🚚', 10),

('shipping', 'phí ship, phí vận chuyển, tiền ship', 
 'Phí vận chuyển là bao nhiêu?', 
 'Phí vận chuyển:\n• Đơn dưới 500.000đ: 30.000đ\n• Đơn từ 500.000đ trở lên: MIỄN PHÍ! 🎉', 10),

-- Return Policy
('policy', 'đổi trả, hoàn tiền, return, refund, đổi hàng', 
 'Chính sách đổi trả như thế nào?', 
 'Chính sách đổi trả BeautyBox:\n✅ Đổi trả trong 7 ngày nếu sản phẩm lỗi từ nhà sản xuất\n✅ Sản phẩm chưa mở seal, còn nguyên hộp\n✅ Hoàn tiền 100% nếu sản phẩm bị lỗi\n\n⚠️ Không áp dụng: Sản phẩm đã mở seal, sản phẩm giảm giá trên 50%', 10),

-- Payment
('payment', 'thanh toán, payment, trả tiền, COD, chuyển khoản', 
 'Có những hình thức thanh toán nào?', 
 'BeautyBox hỗ trợ nhiều hình thức thanh toán:\n💵 COD - Thanh toán khi nhận hàng\n💳 VNPay - Quẹt thẻ/QR Code\n🏦 Chuyển khoản ngân hàng\n\nTất cả đều AN TOÀN & BẢO MẬT!', 10),

-- Skin Type Consultation
('skin_care', 'da dầu, oily skin, da nhờn, kiểm soát dầu', 
 'Tư vấn sản phẩm cho da dầu?', 
 'Với da dầu, bạn nên chọn:\n\n🧴 Sữa rửa mặt: Dạng gel/foam, không chứa dầu\n💧 Toner: Không cồn, có BHA/Salicylic Acid\n🌿 Serum: Niacinamide, Tea Tree\n☀️ Kem chống nắng: Dạng gel, không nhờn\n\nBạn muốn tôi gợi ý sản phẩm cụ thể không?', 9),

('skin_care', 'da khô, dry skin, da thiếu ẩm, khô da', 
 'Tư vấn sản phẩm cho da khô?', 
 'Với da khô, bạn cần:\n\n🧴 Sữa rửa mặt: Dạng cream/milk, dịu nhẹ\n💧 Toner: Hydrating, có Hyaluronic Acid\n🌿 Serum: Hyaluronic Acid, Ceramide\n🧈 Kem dưỡng: Dạng cream đậm đặc\n☀️ Kem chống nắng: Có thêm dưỡng ẩm\n\nBạn muốn xem sản phẩm cụ thể không?', 9),

('skin_care', 'da nhạy cảm, sensitive skin, kích ứng, da yếu', 
 'Tư vấn sản phẩm cho da nhạy cảm?', 
 'Da nhạy cảm cần sản phẩm:\n\n✅ Không hương liệu\n✅ Không paraben\n✅ Thành phần đơn giản\n✅ Có Centella Asiatica, Aloe Vera\n\n⚠️ Tránh: Retinol nồng độ cao, AHA/BHA mạnh\n\nNên test sản phẩm ở vùng da nhỏ trước khi dùng!', 9),

('skin_care', 'da hỗn hợp, combination skin, vừa dầu vừa khô', 
 'Tư vấn sản phẩm cho da hỗn hợp?', 
 'Da hỗn hợp cần chăm sóc đặc biệt:\n\n🧴 Sữa rửa mặt: Dạng gel dịu nhẹ\n💧 Toner: Cân bằng, không cồn\n🌿 Serum: Niacinamide (kiểm soát dầu + dưỡng ẩm)\n\n💡 Tip: Dùng sản phẩm khác nhau cho vùng T và vùng má!', 9),

('skin_care', 'mụn, acne, trị mụn, mụn đầu đen, mụn viêm', 
 'Sản phẩm nào trị mụn hiệu quả?', 
 'Để trị mụn hiệu quả:\n\n🎯 Thành phần nên tìm:\n• Salicylic Acid (BHA)\n• Benzoyl Peroxide\n• Tea Tree Oil\n• Niacinamide\n\n⚠️ Lưu ý: Không nặn mụn, giữ da sạch, tránh stress!\n\nBạn bị loại mụn nào? Tôi sẽ tư vấn cụ thể hơn!', 9),

-- Product Questions
('product', 'hạn sử dụng, expiry, date, hết hạn', 
 'Sản phẩm có hạn sử dụng bao lâu?', 
 'Về hạn sử dụng:\n\n📦 Sản phẩm chưa mở: Xem trên bao bì (thường 2-3 năm)\n📖 Sản phẩm đã mở: Tìm ký hiệu PAO (Period After Opening)\n   • 6M = 6 tháng sau khi mở\n   • 12M = 12 tháng sau khi mở\n\nBeautyBox cam kết chỉ bán sản phẩm còn ít nhất 1 năm hạn sử dụng!', 8),

('product', 'chính hãng, authentic, real, fake, giả', 
 'Sản phẩm có chính hãng không?', 
 'BeautyBox cam kết 100% CHÍNH HÃNG! ✅\n\n🏆 Nhập khẩu trực tiếp từ hãng\n📋 Có đầy đủ giấy tờ nhập khẩu\n🔍 Tem chống hàng giả\n💯 Hoàn tiền 200% nếu phát hiện hàng giả\n\nBạn hoàn toàn yên tâm khi mua sắm tại BeautyBox!', 10),

-- Promotions
('promotion', 'khuyến mãi, giảm giá, sale, discount, voucher, mã giảm', 
 'Có chương trình khuyến mãi nào không?', 
 'Khuyến mãi HOT tại BeautyBox:\n\n🔥 NEWBIE10 - Giảm 10% cho đơn đầu tiên\n🎁 Mua 2 tặng 1 cho sản phẩm chọn lọc\n💝 Tích điểm đổi quà (1.000đ = 1 điểm)\n\nTheo dõi fanpage để cập nhật deal mới nhất nhé!', 8),

-- Skincare Routine
('routine', 'skincare routine, các bước, quy trình, thứ tự', 
 'Quy trình skincare cơ bản như thế nào?', 
 'Quy trình skincare cơ bản:\n\n🌅 BUỔI SÁNG:\n1. Rửa mặt\n2. Toner\n3. Serum (Vitamin C)\n4. Kem dưỡng\n5. Kem chống nắng ☀️\n\n🌙 BUỔI TỐI:\n1. Tẩy trang\n2. Rửa mặt\n3. Toner\n4. Serum (Retinol/AHA)\n5. Kem dưỡng đêm\n\nBạn cần tư vấn chi tiết hơn không?', 9),

-- Contact & Human Support
('contact', 'liên hệ, hotline, contact, điện thoại, email', 
 'Làm sao để liên hệ với BeautyBox?', 
 'Liên hệ BeautyBox:\n\n📞 Hotline: 1900-xxxx (8h-22h)\n📧 Email: support@beautybox.vn\n💬 Chat: Ngay tại đây!\n📍 Showroom: 123 ABC, Quận 1, HCM\n\nHoặc gõ \"người thật\" để được tư vấn viên hỗ trợ trực tiếp!', 10),

('human', 'người thật, nhân viên, tư vấn viên, manager, chat với người, hỗ trợ trực tiếp', 
 'Tôi muốn nói chuyện với nhân viên', 
 'TRANSFER_TO_HUMAN', 10);