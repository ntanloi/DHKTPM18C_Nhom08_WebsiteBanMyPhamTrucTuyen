package iuh.fit.backend.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import iuh.fit.backend.model.ChatFaq;
import iuh.fit.backend.repository.ChatFaqRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatBotService {

    private final ChatFaqRepository chatFaqRepository;

    // Keywords that trigger transfer to human support
    private static final List<String> HUMAN_TRANSFER_KEYWORDS = Arrays.asList(
        "người thật", "nhân viên", "tư vấn viên", "manager", 
        "chat với người", "hỗ trợ trực tiếp", "nói chuyện với người",
        "không muốn bot", "muốn gặp nhân viên"
    );

    /**
     * Generate welcome message when chat starts
     */
    public String getWelcomeMessage(String customerName) {
        return String.format(
            "Xin chào %s! 👋\n\n" +
            "Tôi là BeautyBot - Trợ lý tư vấn mỹ phẩm của BeautyBox.\n\n" +
            "Tôi có thể giúp bạn:\n" +
            "• 💄 Tư vấn sản phẩm phù hợp với loại da\n" +
            "• 📦 Thông tin đơn hàng & vận chuyển\n" +
            "• 💰 Chương trình khuyến mãi\n" +
            "• 🔄 Chính sách đổi trả\n\n" +
            "Bạn cần hỗ trợ gì ạ? 😊",
            customerName != null ? customerName : "bạn"
        );
    }

    /**
     * Process incoming message and generate response
     */
    public BotResponse processMessage(String message) {
        String lowerMessage = message.toLowerCase().trim();
        
        // Check if user requests human support
        if (isHumanTransferRequest(lowerMessage)) {
            return BotResponse.builder()
                .message("Tôi sẽ chuyển bạn đến nhân viên tư vấn ngay. Vui lòng chờ trong giây lát... ⏳")
                .transferToHuman(true)
                .build();
        }

        // Search FAQ for matching response
        Optional<String> faqResponse = findFaqResponse(lowerMessage);
        if (faqResponse.isPresent()) {
            String response = faqResponse.get();
            
            // Check if FAQ indicates transfer to human
            if ("TRANSFER_TO_HUMAN".equals(response)) {
                return BotResponse.builder()
                    .message("Tôi sẽ chuyển bạn đến nhân viên tư vấn ngay. Vui lòng chờ trong giây lát... ⏳")
                    .transferToHuman(true)
                    .build();
            }
            
            return BotResponse.builder()
                .message(response)
                .transferToHuman(false)
                .build();
        }

        // No matching FAQ found
        return getDefaultResponse();
    }

    /**
     * Check if message requests human support
     */
    private boolean isHumanTransferRequest(String message) {
        return HUMAN_TRANSFER_KEYWORDS.stream()
            .anyMatch(keyword -> message.contains(keyword));
    }

    /**
     * Search FAQ database for matching response
     */
    private Optional<String> findFaqResponse(String message) {
        try {
            // Try fulltext search first
            List<ChatFaq> faqs = chatFaqRepository.searchByKeyword(message);
            
            if (faqs.isEmpty()) {
                // Fallback to LIKE search
                faqs = chatFaqRepository.searchByKeywordLike(message);
            }
            
            if (!faqs.isEmpty()) {
                return Optional.of(faqs.get(0).getAnswer());
            }
            
            // Search by checking individual keywords
            List<ChatFaq> allFaqs = chatFaqRepository.findByIsActiveTrueOrderByPriorityDesc();
            for (ChatFaq faq : allFaqs) {
                String[] keywords = faq.getKeywords().toLowerCase().split(",");
                for (String keyword : keywords) {
                    if (message.contains(keyword.trim())) {
                        return Optional.of(faq.getAnswer());
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error searching FAQ: {}", e.getMessage());
        }
        
        return Optional.empty();
    }

    /**
     * Generate default response when no FAQ matches
     */
    private BotResponse getDefaultResponse() {
        return BotResponse.builder()
            .message(
                "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. 😅\n\n" +
                "Bạn có thể thử:\n" +
                "• Hỏi về loại da (da dầu, da khô, da nhạy cảm...)\n" +
                "• Hỏi về sản phẩm trị mụn, dưỡng ẩm...\n" +
                "• Hỏi về đơn hàng, giao hàng\n" +
                "• Hỏi về khuyến mãi\n\n" +
                "Hoặc gõ \"người thật\" để được nhân viên hỗ trợ trực tiếp! 🙋"
            )
            .transferToHuman(false)
            .build();
    }

    /**
     * Get suggested quick replies for the chat interface
     */
    public List<String> getQuickReplies() {
        return Arrays.asList(
            "Tư vấn da dầu",
            "Tư vấn da khô",
            "Sản phẩm trị mụn",
            "Thông tin giao hàng",
            "Chính sách đổi trả",
            "Chat với nhân viên"
        );
    }

    /**
     * Bot response wrapper class
     */
    @lombok.Builder
    @lombok.Data
    public static class BotResponse {
        private String message;
        private boolean transferToHuman;
        private List<String> quickReplies;
        private Object productSuggestions;
    }
}
