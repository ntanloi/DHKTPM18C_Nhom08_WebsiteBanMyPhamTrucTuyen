package iuh.fit.backend.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import iuh.fit.backend.model.Brand;
import iuh.fit.backend.model.Category;
import iuh.fit.backend.model.Product;
import iuh.fit.backend.repository.BrandRepository;
import iuh.fit.backend.repository.CategoryRepository;
import iuh.fit.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiAIService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    
    @Value("${gemini.api.key:}")
    private String apiKey;
    
    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String apiUrl;

    /**
     * Check if Gemini AI is configured and available
     */
    public boolean isAvailable() {
        return apiKey != null && !apiKey.isEmpty() && !apiKey.equals("your_gemini_api_key_here");
    }

    /**
     * Generate response using Gemini AI with RAG context
     */
    public String generateResponse(String userMessage) {
        if (!isAvailable()) {
            log.warn("Gemini AI is not configured. Skipping AI response.");
            return null;
        }

        try {
            // Build RAG context from database
            String ragContext = buildRAGContext(userMessage);
            
            // Build prompt with context
            String systemPrompt = buildSystemPrompt(ragContext);
            String fullPrompt = systemPrompt + "\n\nCâu hỏi của khách hàng: " + userMessage;
            
            // Call Gemini API
            return callGeminiAPI(fullPrompt);
        } catch (Exception e) {
            log.error("Error generating AI response: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Build RAG context from database
     */
    private String buildRAGContext(String userMessage) {
        StringBuilder context = new StringBuilder();
        String lowerMessage = userMessage.toLowerCase();
        
        // Get relevant products
        List<Product> products = productRepository.findAll();
        List<Product> relevantProducts = products.stream()
            .filter(p -> {
                String productInfo = (p.getName() + " " + p.getDescription()).toLowerCase();
                return containsAnyKeyword(lowerMessage, productInfo) || 
                       containsAnyKeyword(productInfo, lowerMessage);
            })
            .limit(5)
            .collect(Collectors.toList());
        
        if (!relevantProducts.isEmpty()) {
            context.append("\n=== SẢN PHẨM LIÊN QUAN ===\n");
            for (Product p : relevantProducts) {
                // Get variant price if available
                String priceInfo = "Liên hệ";
                if (p.getProductVariant() != null && p.getProductVariant().getPrice() != null) {
                    priceInfo = p.getProductVariant().getPrice().toString() + " VNĐ";
                }
                
                context.append(String.format("- %s: %s (Giá: %s)\n", 
                    p.getName(), 
                    p.getDescription() != null ? p.getDescription().substring(0, Math.min(100, p.getDescription().length())) : "",
                    priceInfo));
            }
        }
        
        // Get categories
        List<Category> categories = categoryRepository.findAll();
        context.append("\n=== DANH MỤC SẢN PHẨM ===\n");
        for (Category c : categories) {
            context.append(String.format("- %s\n", c.getName()));
        }
        
        // Get brands
        List<Brand> brands = brandRepository.findAll();
        context.append("\n=== THƯƠNG HIỆU ===\n");
        for (Brand b : brands) {
            context.append(String.format("- %s\n", b.getName()));
        }
        
        // Store policies
        context.append("\n=== CHÍNH SÁCH CỬA HÀNG ===\n");
        context.append("- Miễn phí vận chuyển cho đơn hàng từ 500.000 VNĐ\n");
        context.append("- Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi hoặc không đúng\n");
        context.append("- Thanh toán: COD, VNPay, Chuyển khoản\n");
        context.append("- Thời gian giao hàng: 2-5 ngày làm việc\n");
        context.append("- Hotline: 1900-xxxx (8h-22h hàng ngày)\n");
        
        return context.toString();
    }
    
    private boolean containsAnyKeyword(String text, String keywords) {
        String[] words = keywords.split("\\s+");
        for (String word : words) {
            if (word.length() > 3 && text.contains(word)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Build system prompt for AI
     */
    private String buildSystemPrompt(String ragContext) {
        return """
            Bạn là BeautyBot - Trợ lý tư vấn mỹ phẩm thông minh của BeautyBox.
            
            NGUYÊN TẮC TRẢ LỜI:
            1. Trả lời ngắn gọn, thân thiện, chuyên nghiệp
            2. Sử dụng emoji phù hợp để tạo cảm giác thân thiện
            3. Tập trung vào mỹ phẩm, làm đẹp, skincare
            4. Nếu câu hỏi KHÔNG liên quan đến mỹ phẩm/làm đẹp/cửa hàng, 
               hãy từ chối nhẹ nhàng và hướng về chủ đề chính
            5. Đề xuất sản phẩm cụ thể khi có thể
            6. Nếu không chắc chắn, khuyên khách liên hệ nhân viên tư vấn
            
            THÔNG TIN CỬA HÀNG:
            """ + ragContext + """
            
            PHẠM VI TRẢ LỜI:
            ✅ Tư vấn skincare, makeup, chăm sóc da
            ✅ Thông tin sản phẩm, giá cả, thành phần
            ✅ Chính sách giao hàng, đổi trả, thanh toán
            ✅ Khuyến mãi, ưu đãi
            ❌ Không trả lời về chính trị, tôn giáo, bạo lực
            ❌ Không tư vấn y tế chuyên sâu
            ❌ Không chia sẻ thông tin cá nhân
            
            Nếu câu hỏi nằm ngoài phạm vi, hãy trả lời:
            "Xin lỗi, tôi chỉ có thể tư vấn về mỹ phẩm và dịch vụ của BeautyBox. 
            Bạn có câu hỏi nào về sản phẩm làm đẹp không ạ? 💄"
            """;
    }

    /**
     * Call Gemini API
     */
    private String callGeminiAPI(String prompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                ),
                "generationConfig", Map.of(
                    "temperature", 0.7,
                    "maxOutputTokens", 500,
                    "topP", 0.9
                )
            );
            
            String fullUrl = apiUrl + "?key=" + apiKey;
            
            String response = WebClient.create()
                .post()
                .uri(fullUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(this::extractResponseText)
                .block();
            
            return response;
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            return null;
        }
    }
    
    @SuppressWarnings("unchecked")
    private String extractResponseText(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            log.error("Error extracting response text: {}", e.getMessage());
        }
        return null;
    }
}
