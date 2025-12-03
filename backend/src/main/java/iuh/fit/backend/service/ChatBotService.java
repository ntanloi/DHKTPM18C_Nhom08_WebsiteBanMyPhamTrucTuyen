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
    private final GeminiAIService geminiAIService;

    // Keywords that trigger transfer to human support (includes non-accent variants)
    private static final List<String> HUMAN_TRANSFER_KEYWORDS = Arrays.asList(
        // Vietnamese with accents
        "người thật", "nhân viên", "tư vấn viên", "manager", 
        "chat với người", "hỗ trợ trực tiếp", "nói chuyện với người",
        "không muốn bot", "muốn gặp nhân viên", "gặp người", "chat người",
        "gặp nhân viên",
        // Non-accent variants (common typing)
        "nguoi that", "nhan vien", "tu van vien", 
        "chat voi nguoi", "ho tro truc tiep", "noi chuyen voi nguoi",
        "khong muon bot", "muon gap nhan vien", "gap nguoi", "gap nhan vien"
    );

    /**
     * Generate welcome message when chat starts
     */
    public String getWelcomeMessage(String customerName) {
        String name = customerName != null && !customerName.isEmpty() ? customerName : "quý khách";
        return String.format(
            "Xin chào %s! 👋\n\n" +
            "Chào mừng bạn đến với BeautyBox - Thiên đường mỹ phẩm chính hãng! 💄✨\n\n" +
            "Tôi là BeautyBot, trợ lý tư vấn thông minh của bạn. Tôi có thể hỗ trợ:\n\n" +
            "💆 Tư vấn sản phẩm phù hợp với loại da\n" +
            "🛍️ Thông tin đơn hàng & vận chuyển\n" +
            "🎁 Chương trình khuyến mãi hot\n" +
            "🔄 Chính sách đổi trả & bảo hành\n\n" +
            "Bạn cần tôi hỗ trợ gì hôm nay ạ? 😊\n\n" +
            "💡 Gõ \"nhân viên\" nếu muốn chat trực tiếp với tư vấn viên!",
            name
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
                .message("Tôi sẽ kết nối bạn với nhân viên tư vấn ngay! 🙋‍♀️\n\nVui lòng chờ trong giây lát, nhân viên sẽ phản hồi sớm nhất có thể. ⏳")
                .transferToHuman(true)
                .quickReplies(null)
                .build();
        }

        // Search FAQ for matching response
        Optional<String> faqResponse = findFaqResponse(lowerMessage);
        if (faqResponse.isPresent()) {
            String response = faqResponse.get();
            
            // Check if FAQ indicates transfer to human
            if ("TRANSFER_TO_HUMAN".equals(response)) {
                return BotResponse.builder()
                    .message("Để hỗ trợ bạn tốt nhất, tôi sẽ kết nối bạn với nhân viên tư vấn! 🙋‍♀️\n\nVui lòng chờ trong giây lát... ⏳")
                    .transferToHuman(true)
                    .build();
            }
            
            return BotResponse.builder()
                .message(response)
                .transferToHuman(false)
                .quickReplies(getQuickReplies())
                .build();
        }

        // Try AI response if FAQ not found
        if (geminiAIService.isAvailable()) {
            String aiResponse = geminiAIService.generateResponse(message);
            if (aiResponse != null && !aiResponse.isEmpty()) {
                return BotResponse.builder()
                    .message(aiResponse)
                    .transferToHuman(false)
                    .quickReplies(getQuickReplies())
                    .build();
            }
        }

        // No matching FAQ and AI not available
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
     * Uses strict matching to avoid false positives
     */
    private Optional<String> findFaqResponse(String message) {
        try {
            // Skip FAQ search for very short messages (likely greetings or unclear)
            if (message.length() < 5) {
                return Optional.empty();
            }
            
            // Search by checking individual keywords with stricter matching
            List<ChatFaq> allFaqs = chatFaqRepository.findByIsActiveTrueOrderByPriorityDesc();
            ChatFaq bestMatch = null;
            int bestMatchScore = 0;
            
            for (ChatFaq faq : allFaqs) {
                String[] keywords = faq.getKeywords().toLowerCase().split(",");
                int matchScore = 0;
                
                for (String keyword : keywords) {
                    String trimmedKeyword = keyword.trim();
                    // Only match keywords with at least 3 characters to avoid false positives
                    if (trimmedKeyword.length() >= 3 && message.contains(trimmedKeyword)) {
                        // Longer keyword matches are more significant
                        matchScore += trimmedKeyword.length();
                    }
                }
                
                // Require minimum match score (at least one meaningful keyword)
                if (matchScore > bestMatchScore && matchScore >= 4) {
                    bestMatchScore = matchScore;
                    bestMatch = faq;
                }
            }
            
            if (bestMatch != null) {
                log.debug("FAQ matched with score {}: {}", bestMatchScore, bestMatch.getQuestion());
                return Optional.of(bestMatch.getAnswer());
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
                "Cảm ơn bạn đã nhắn tin! 😊\n\n" +
                "Tôi chưa tìm thấy thông tin phù hợp với câu hỏi của bạn. " +
                "Bạn có thể thử:\n\n" +
                "💄 Hỏi về loại da (da dầu, da khô, da nhạy cảm...)\n" +
                "🧴 Hỏi về sản phẩm trị mụn, dưỡng ẩm, chống nắng...\n" +
                "📦 Hỏi về đơn hàng, giao hàng\n" +
                "🎁 Hỏi về khuyến mãi\n\n" +
                "Hoặc gõ \"nhân viên\" để được tư vấn viên hỗ trợ trực tiếp! 🙋‍♀️"
            )
            .transferToHuman(false)
            .quickReplies(getQuickReplies())
            .build();
    }

    /**
     * Get suggested quick replies for the chat interface
     */
    public List<String> getQuickReplies() {
        return Arrays.asList(
            "Tư vấn da dầu 🌊",
            "Tư vấn da khô 🏜️",
            "Sản phẩm trị mụn 💊",
            "Giao hàng 📦",
            "Đổi trả 🔄",
            "Gặp nhân viên 🙋"
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
