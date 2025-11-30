package iuh.fit.backend.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import iuh.fit.backend.dto.ChatMessageRequest;
import iuh.fit.backend.dto.ChatMessageResponse;
import iuh.fit.backend.model.ChatRoom;
import iuh.fit.backend.model.enums.SenderType;
import iuh.fit.backend.repository.ChatRoomRepository;
import iuh.fit.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * WebSocket Controller for real-time chat
 * 
 * Client subscribe to:
 * - /topic/chat/{roomId} - Receive messages in room
 * - /topic/chat/pending - Manager receives new pending room notifications
 * - /user/queue/chat - Receive private messages
 * 
 * Client send to:
 * - /app/chat.send/{roomId} - Send message
 * - /app/chat.typing/{roomId} - Typing indicator
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final ChatRoomRepository chatRoomRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Customer sends a message
     */
    @MessageMapping("/chat.send/{roomId}")
    public void sendMessage(
            @DestinationVariable String roomId,
            @Payload ChatMessageRequest request,
            Principal principal) {
        
        try {
            // Set roomId from path
            request.setRoomId(roomId);
            
            // Get userId from principal (assumes WebSocket authentication)
            Integer userId = getUserIdFromPrincipal(principal);
            
            // Determine sender type
            ChatRoom room = chatRoomRepository.findById(roomId).orElse(null);
            if (room == null) {
                log.error("Room not found: {}", roomId);
                return;
            }
            
            ChatMessageResponse response;
            
            if (room.getCustomerId().equals(userId)) {
                // Customer sends
                response = chatService.sendCustomerMessage(userId, request);
                
                // Broadcast customer message
                messagingTemplate.convertAndSend("/topic/chat/" + roomId, response);
                
                // If bot replies, also broadcast
                // (Bot reply is handled in ChatService and saved to DB)
                // Need to fetch latest bot message
                if (room.getRoomType().name().equals("BOT")) {
                    // Send delayed to allow bot message to be saved
                    Thread.sleep(100);
                    var messages = chatService.getMessages(roomId, 0, 2);
                    if (messages.size() > 0 && messages.get(messages.size() - 1).getSenderType() == SenderType.BOT) {
                        messagingTemplate.convertAndSend("/topic/chat/" + roomId, 
                            messages.get(messages.size() - 1));
                    }
                }
                
                // If room changes to PENDING, notify managers
                ChatRoom updatedRoom = chatRoomRepository.findById(roomId).orElse(null);
                if (updatedRoom != null && updatedRoom.getStatus().name().equals("PENDING")) {
                    messagingTemplate.convertAndSend("/topic/chat/pending", 
                        chatService.getRoomInfo(roomId));
                }
                
            } else if (room.getManagerId() != null && room.getManagerId().equals(userId)) {
                // Manager sends
                response = chatService.sendManagerMessage(userId, request);
                messagingTemplate.convertAndSend("/topic/chat/" + roomId, response);
            } else {
                log.warn("User {} doesn't have access to room {}", userId, roomId);
            }
            
        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage(), e);
        }
    }

    /**
     * Typing indicator notification
     */
    @MessageMapping("/chat.typing/{roomId}")
    public void typing(
            @DestinationVariable String roomId,
            Principal principal) {
        
        Integer userId = getUserIdFromPrincipal(principal);
        
        TypingNotification notification = new TypingNotification(userId, roomId, true);
        messagingTemplate.convertAndSend("/topic/chat/" + roomId + "/typing", notification);
    }

    /**
     * Manager accepts a room
     */
    @MessageMapping("/chat.accept/{roomId}")
    public void acceptRoom(
            @DestinationVariable String roomId,
            Principal principal) {
        
        try {
            Integer managerId = getUserIdFromPrincipal(principal);
            var roomResponse = chatService.acceptRoom(roomId, managerId);
            
            // Broadcast room status update
            messagingTemplate.convertAndSend("/topic/chat/" + roomId + "/status", roomResponse);
            
            // Notify other managers that room has been accepted
            messagingTemplate.convertAndSend("/topic/chat/pending/accepted", roomId);
            
        } catch (Exception e) {
            log.error("Error accepting room: {}", e.getMessage(), e);
        }
    }

    /**
     * Close a room
     */
    @MessageMapping("/chat.close/{roomId}")
    public void closeRoom(
            @DestinationVariable String roomId,
            @Payload(required = false) CloseRoomRequest request,
            Principal principal) {
        
        try {
            Integer rating = request != null ? request.getRating() : null;
            String feedback = request != null ? request.getFeedback() : null;
            
            var roomResponse = chatService.closeRoom(roomId, rating, feedback);
            
            // Broadcast room closed
            messagingTemplate.convertAndSend("/topic/chat/" + roomId + "/status", roomResponse);
            
        } catch (Exception e) {
            log.error("Error closing room: {}", e.getMessage(), e);
        }
    }

    /**
     * Mark messages as read
     */
    @MessageMapping("/chat.read/{roomId}")
    public void markAsRead(
            @DestinationVariable String roomId,
            @Payload ReadRequest request,
            Principal principal) {
        
        try {
            chatService.markMessagesAsRead(roomId, request.getSenderType());
            
            // Broadcast read status
            messagingTemplate.convertAndSend("/topic/chat/" + roomId + "/read", 
                new ReadNotification(roomId, request.getSenderType()));
            
        } catch (Exception e) {
            log.error("Error marking messages as read: {}", e.getMessage(), e);
        }
    }

    /**
     * Helper method to get userId from principal
     * In production, implement proper WebSocket authentication
     */
    private Integer getUserIdFromPrincipal(Principal principal) {
        if (principal == null) {
            throw new IllegalStateException("User not authenticated");
        }
        try {
            return Integer.parseInt(principal.getName());
        } catch (NumberFormatException e) {
            throw new IllegalStateException("Invalid user ID in principal");
        }
    }

    // DTO classes
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class TypingNotification {
        private Integer userId;
        private String roomId;
        private boolean typing;
    }

    @lombok.Data
    public static class CloseRoomRequest {
        private Integer rating;
        private String feedback;
    }

    @lombok.Data
    public static class ReadRequest {
        private SenderType senderType;
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    public static class ReadNotification {
        private String roomId;
        private SenderType senderType;
    }
}
