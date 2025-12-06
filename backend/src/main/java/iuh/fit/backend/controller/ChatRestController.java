package iuh.fit.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import iuh.fit.backend.dto.ChatMessageRequest;
import iuh.fit.backend.dto.ChatMessageResponse;
import iuh.fit.backend.dto.ChatRoomResponse;
import iuh.fit.backend.model.ChatRoom;
import iuh.fit.backend.security.CustomUserDetails;
import iuh.fit.backend.service.ChatService;
import lombok.RequiredArgsConstructor;

/**
 * REST API for Chat functionality
 * Used in combination with WebSocket for real-time messaging
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatService chatService;

    // ==================== Customer APIs ====================

    /**
     * Initialize or get customer's chat room
     */
    @PostMapping("/rooms/init")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'USER', 'ADMIN', 'MANAGER')")
    public ResponseEntity<ChatRoomResponse> initRoom(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        ChatRoom room = chatService.getOrCreateRoom(userDetails.getId());
        return ResponseEntity.ok(chatService.getRoomInfo(room.getId()));
    }

    /**
     * Get room information
     */
    @GetMapping("/rooms/{roomId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'USER', 'ADMIN', 'MANAGER', 'SUPPORT')")
    public ResponseEntity<ChatRoomResponse> getRoomInfo(
            @PathVariable String roomId) {
        
        return ResponseEntity.ok(chatService.getRoomInfo(roomId));
    }

    /**
     * Get current customer's rooms
     */
    @GetMapping("/rooms/my")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'USER', 'ADMIN', 'MANAGER')")
    public ResponseEntity<List<ChatRoomResponse>> getMyRooms(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        return ResponseEntity.ok(chatService.getCustomerRooms(userDetails.getId()));
    }

    /**
     * Send message (fallback when WebSocket unavailable)
     */
    @PostMapping("/rooms/{roomId}/messages")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'USER', 'ADMIN', 'MANAGER', 'SUPPORT')")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @PathVariable String roomId,
            @RequestBody ChatMessageRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        request.setRoomId(roomId);
        
        // Check permissions and send message
        ChatRoomResponse room = chatService.getRoomInfo(roomId);
        
        ChatMessageResponse response;
        if (room.getCustomerId().equals(userDetails.getId())) {
            response = chatService.sendCustomerMessage(userDetails.getId(), request);
        } else if (room.getManagerId() != null && room.getManagerId().equals(userDetails.getId())) {
            response = chatService.sendManagerMessage(userDetails.getId(), request);
        } else if (room.getSupportId() != null && room.getSupportId().equals(userDetails.getId())) {
            response = chatService.sendSupportMessage(userDetails.getId(), request);
        } else {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get message history
     */
    @GetMapping("/rooms/{roomId}/messages")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'USER', 'ADMIN', 'MANAGER', 'SUPPORT')")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        return ResponseEntity.ok(chatService.getMessages(roomId, page, size));
    }

    /**
     * Close room and submit rating
     */
    @PostMapping("/rooms/{roomId}/close")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'USER', 'ADMIN', 'MANAGER', 'SUPPORT')")
    public ResponseEntity<ChatRoomResponse> closeRoom(
            @PathVariable String roomId,
            @RequestBody(required = false) Map<String, Object> body) {
        
        Integer rating = body != null && body.get("rating") != null ? 
            ((Number) body.get("rating")).intValue() : null;
        String feedback = body != null ? (String) body.get("feedback") : null;
        
        return ResponseEntity.ok(chatService.closeRoom(roomId, rating, feedback));
    }

    // ==================== Manager APIs ====================

    /**
     * Get pending rooms list
     */
    @GetMapping("/manager/rooms/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPPORT')")
    public ResponseEntity<List<ChatRoomResponse>> getPendingRooms() {
        return ResponseEntity.ok(chatService.getPendingRooms());
    }

    /**
     * Get manager's rooms
     */
    @GetMapping("/manager/rooms/my")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPPORT')")
    public ResponseEntity<List<ChatRoomResponse>> getManagerRooms(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        return ResponseEntity.ok(chatService.getManagerRooms(userDetails.getId()));
    }

    /**
     * Accept room for support
     */
    @PostMapping("/manager/rooms/{roomId}/accept")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPPORT')")
    public ResponseEntity<ChatRoomResponse> acceptRoom(
            @PathVariable String roomId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        return ResponseEntity.ok(chatService.acceptRoom(roomId, userDetails.getId()));
    }

    /**
     * Get pending room count
     */
    @GetMapping("/manager/rooms/pending/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPPORT')")
    public ResponseEntity<Map<String, Long>> getPendingRoomCount() {
        return ResponseEntity.ok(Map.of("count", chatService.countPendingRooms()));
    }

    /**
     * Manager sends message
     */
    @PostMapping("/manager/rooms/{roomId}/messages")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SUPPORT')")
    public ResponseEntity<ChatMessageResponse> sendManagerMessage(
            @PathVariable String roomId,
            @RequestBody ChatMessageRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        request.setRoomId(roomId);
        return ResponseEntity.ok(chatService.sendSupportMessage(userDetails.getId(), request));
    }
}
