package iuh.fit.backend.controller;

import iuh.fit.backend.dto.NotificationMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    /**
     * Handle ping/pong for connection keep-alive
     */
    @MessageMapping("/ping")
    @SendTo("/topic/pong")
    public String ping() {
        return "pong";
    }

    /**
     * Handle user joining notification channel
     */
    @MessageMapping("/notifications/subscribe")
    public void subscribeNotifications(@Payload String message, 
                                       SimpMessageHeaderAccessor headerAccessor,
                                       Principal principal) {
        String userId = principal != null ? principal.getName() : "anonymous";
        log.info("User {} subscribed to notifications", userId);
        
        // Store user session if needed
        if (headerAccessor.getSessionAttributes() != null) {
            headerAccessor.getSessionAttributes().put("userId", userId);
        }
    }

    /**
     * Echo endpoint for testing
     */
    @MessageMapping("/echo")
    @SendTo("/topic/echo")
    public NotificationMessage echo(@Payload NotificationMessage message) {
        log.info("Echo message: {}", message);
        return message;
    }
}
