package iuh.fit.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import iuh.fit.backend.service.ChatBotService;
import iuh.fit.backend.service.ChatBotService.BotResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST API for Guest Chat - No authentication required
 * Provides chatbot-only functionality for guests
 */
@RestController
@RequestMapping("/api/chat/guest")
@RequiredArgsConstructor
@Slf4j
public class GuestChatController {

    private final ChatBotService chatBotService;
    
    // Simple in-memory session storage for guests
    private final Map<String, GuestSession> guestSessions = new ConcurrentHashMap<>();
    
    /**
     * Initialize a guest chat session
     */
    @PostMapping("/init")
    public ResponseEntity<GuestChatResponse> initGuestChat(@RequestBody(required = false) Map<String, String> body) {
        String guestName = body != null ? body.get("name") : null;
        
        // Create session ID
        String sessionId = UUID.randomUUID().toString();
        
        // Create session
        GuestSession session = new GuestSession(sessionId, guestName);
        guestSessions.put(sessionId, session);
        
        // Get welcome message
        String welcomeMessage = chatBotService.getWelcomeMessage(guestName);
        List<String> quickReplies = chatBotService.getQuickReplies();
        
        log.info("Guest chat initialized: sessionId={}, name={}", sessionId, guestName);
        
        return ResponseEntity.ok(GuestChatResponse.builder()
            .sessionId(sessionId)
            .message(welcomeMessage)
            .senderType("BOT")
            .quickReplies(quickReplies)
            .canTransferToHuman(true)
            .build());
    }
    
    /**
     * Send message in guest chat (bot only)
     */
    @PostMapping("/{sessionId}/messages")
    public ResponseEntity<?> sendGuestMessage(
            @PathVariable String sessionId,
            @RequestBody Map<String, String> body) {
        
        // Validate session
        GuestSession session = guestSessions.get(sessionId);
        if (session == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid session",
                "message", "Please initialize chat first"
            ));
        }
        
        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Empty message",
                "message", "Message content is required"
            ));
        }
        
        // Process with bot
        BotResponse botResponse = chatBotService.processMessage(content);
        
        // Check if user wants human support
        if (botResponse.isTransferToHuman()) {
            session.setRequestedHuman(true);
            
            return ResponseEntity.ok(GuestChatResponse.builder()
                .sessionId(sessionId)
                .message(botResponse.getMessage() + 
                    "\n\n💡 Để được hỗ trợ từ nhân viên, vui lòng đăng nhập hoặc đăng ký tài khoản!")
                .senderType("BOT")
                .quickReplies(null)
                .canTransferToHuman(true)
                .requiresLogin(true)
                .build());
        }
        
        return ResponseEntity.ok(GuestChatResponse.builder()
            .sessionId(sessionId)
            .message(botResponse.getMessage())
            .senderType("BOT")
            .quickReplies(botResponse.getQuickReplies())
            .canTransferToHuman(true)
            .build());
    }
    
    /**
     * Get quick replies
     */
    @GetMapping("/quick-replies")
    public ResponseEntity<List<String>> getQuickReplies() {
        return ResponseEntity.ok(chatBotService.getQuickReplies());
    }
    
    /**
     * Check if bot service is available
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        return ResponseEntity.ok(Map.of(
            "available", true,
            "botName", "BeautyBot",
            "supportHours", "24/7 (Bot) | 8h-22h (Nhân viên)"
        ));
    }
    
    // ==================== DTOs ====================
    
    @lombok.Data
    @lombok.AllArgsConstructor
    private static class GuestSession {
        private String sessionId;
        private String guestName;
        private boolean requestedHuman;
        
        public GuestSession(String sessionId, String guestName) {
            this.sessionId = sessionId;
            this.guestName = guestName;
            this.requestedHuman = false;
        }
    }
    
    @lombok.Data
    @lombok.Builder
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    public static class GuestChatResponse {
        private String sessionId;
        private String message;
        private String senderType;
        private List<String> quickReplies;
        private boolean canTransferToHuman;
        private boolean requiresLogin;
    }
}
