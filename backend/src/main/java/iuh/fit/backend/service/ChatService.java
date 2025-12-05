package iuh.fit.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import iuh.fit.backend.dto.ChatMessageRequest;
import iuh.fit.backend.dto.ChatMessageResponse;
import iuh.fit.backend.dto.ChatRoomResponse;
import iuh.fit.backend.exception.ResourceNotFoundException;
import iuh.fit.backend.model.ChatMessage;
import iuh.fit.backend.model.ChatRoom;
import iuh.fit.backend.model.User;
import iuh.fit.backend.model.enums.MessageType;
import iuh.fit.backend.model.enums.RoomStatus;
import iuh.fit.backend.model.enums.RoomType;
import iuh.fit.backend.model.enums.SenderType;
import iuh.fit.backend.repository.ChatMessageRepository;
import iuh.fit.backend.repository.ChatRoomRepository;
import iuh.fit.backend.repository.UserRepository;
import iuh.fit.backend.service.ChatBotService.BotResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ChatBotService chatBotService;

    // ==================== Room Management ====================

    /**
     * Get or create a chat room for customer
     */
    @Transactional
    public ChatRoom getOrCreateRoom(Integer customerId) {
        // Check if customer has an active room
        List<ChatRoom> activeRooms = chatRoomRepository.findActiveRoomsByCustomerId(customerId);
        
        if (!activeRooms.isEmpty()) {
            return activeRooms.get(0);
        }
        
        // Create new room
        ChatRoom room = ChatRoom.builder()
            .customerId(customerId)
            .roomType(RoomType.BOT)
            .status(RoomStatus.OPEN)
            .build();
        
        room = chatRoomRepository.save(room);
        
        // Send welcome message from bot
        User customer = userRepository.findById(customerId).orElse(null);
        String welcomeMsg = chatBotService.getWelcomeMessage(
            customer != null ? customer.getFullName() : null
        );
        
        saveMessage(room.getId(), null, SenderType.BOT, welcomeMsg, MessageType.TEXT);
        
        return room;
    }

    /**
     * Get room information
     */
    public ChatRoomResponse getRoomInfo(String roomId) {
        ChatRoom room = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));
        
        return mapToRoomResponse(room);
    }

    /**
     * Get customer's chat rooms
     */
    public List<ChatRoomResponse> getCustomerRooms(Integer customerId) {
        List<ChatRoom> rooms = chatRoomRepository.findActiveRoomsByCustomerId(customerId);
        return rooms.stream().map(this::mapToRoomResponse).collect(Collectors.toList());
    }

    /**
     * Get pending rooms (for manager)
     */
    public List<ChatRoomResponse> getPendingRooms() {
        List<ChatRoom> rooms = chatRoomRepository.findPendingRoomsWithoutManager();
        return rooms.stream().map(this::mapToRoomResponse).collect(Collectors.toList());
    }

    /**
     * Get rooms being handled by manager
     */
    public List<ChatRoomResponse> getManagerRooms(Integer managerId) {
        List<ChatRoom> rooms = chatRoomRepository.findActiveRoomsByManagerId(managerId);
        return rooms.stream().map(this::mapToRoomResponse).collect(Collectors.toList());
    }

    /**
     * Manager accepts a room
     */
    @Transactional
    public ChatRoomResponse acceptRoom(String roomId, Integer managerId) {
        ChatRoom room = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));
        
        if (room.getStatus() != RoomStatus.PENDING) {
            throw new IllegalStateException("Room is not in pending status");
        }
        
        room.setManagerId(managerId);
        room.setStatus(RoomStatus.ASSIGNED);
        room.setRoomType(RoomType.HUMAN);
        room = chatRoomRepository.save(room);
        
        // Send system notification
        User manager = userRepository.findById(managerId).orElse(null);
        String managerName = manager != null ? manager.getFullName() : "Support Staff";
        saveMessage(roomId, null, SenderType.SYSTEM, 
            String.format("✅ %s has joined to assist you!", managerName), 
            MessageType.SYSTEM);
        
        return mapToRoomResponse(room);
    }

    /**
     * Close a room
     */
    @Transactional
    public ChatRoomResponse closeRoom(String roomId, Integer rating, String feedback) {
        ChatRoom room = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));
        
        room.setStatus(RoomStatus.CLOSED);
        room.setClosedAt(LocalDateTime.now());
        
        if (rating != null) {
            room.setRating(rating);
        }
        if (feedback != null) {
            room.setFeedback(feedback);
        }
        
        room = chatRoomRepository.save(room);
        
        // Send notification
        saveMessage(roomId, null, SenderType.SYSTEM, 
            "The conversation has ended. Thank you for using our service! 🙏", 
            MessageType.SYSTEM);
        
        return mapToRoomResponse(room);
    }

    // ==================== Message Management ====================

    /**
     * Send message from customer
     */
    @Transactional
    public ChatMessageResponse sendCustomerMessage(Integer customerId, ChatMessageRequest request) {
        String roomId = request.getRoomId();
        
        // Verify room exists and belongs to customer
        ChatRoom room = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));
        
        if (!room.getCustomerId().equals(customerId)) {
            throw new IllegalArgumentException("You don't have access to this room");
        }
        
        // Save customer message
        ChatMessage customerMsg = saveMessage(
            roomId, customerId, SenderType.CUSTOMER, 
            request.getContent(), 
            request.getMessageType() != null ? request.getMessageType() : MessageType.TEXT
        );
        
        ChatMessageResponse response = mapToMessageResponse(customerMsg);
        
        // If chatting with bot, process and reply
        if (room.getRoomType() == RoomType.BOT && room.getStatus() == RoomStatus.OPEN) {
            BotResponse botResponse = chatBotService.processMessage(request.getContent());
            
            if (botResponse.isTransferToHuman()) {
                // Switch to pending human support mode
                room.setStatus(RoomStatus.PENDING);
                chatRoomRepository.save(room);
            }
            
            // Save bot message
            saveMessage(roomId, null, SenderType.BOT, botResponse.getMessage(), MessageType.TEXT);
        }
        
        return response;
    }

    /**
     * Send message from manager
     */
    @Transactional
    public ChatMessageResponse sendManagerMessage(Integer managerId, ChatMessageRequest request) {
        String roomId = request.getRoomId();
        
        ChatRoom room = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));
        
        if (!managerId.equals(room.getManagerId())) {
            throw new IllegalArgumentException("You are not assigned to this room");
        }
        
        ChatMessage message = saveMessage(
            roomId, managerId, SenderType.MANAGER,
            request.getContent(),
            request.getMessageType() != null ? request.getMessageType() : MessageType.TEXT
        );
        
        return mapToMessageResponse(message);
    }

    /**
     * Send message from support staff
     */
    @Transactional
    public ChatMessageResponse sendSupportMessage(Integer supportId, ChatMessageRequest request) {
        String roomId = request.getRoomId();
        
        ChatRoom room = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));
        
        if (!supportId.equals(room.getManagerId())) {
            throw new IllegalArgumentException("You are not assigned to this room");
        }
        
        ChatMessage message = saveMessage(
            roomId, supportId, SenderType.SUPPORT,
            request.getContent(),
            request.getMessageType() != null ? request.getMessageType() : MessageType.TEXT
        );
        
        return mapToMessageResponse(message);
    }

    /**
     * Get message history
     */
    public List<ChatMessageResponse> getMessages(String roomId, int page, int size) {
        List<ChatMessage> messages = chatMessageRepository
            .findByRoomIdOrderByCreatedAtDesc(roomId, PageRequest.of(page, size))
            .getContent();
        
        // Reverse to display in chronological order
        List<ChatMessageResponse> responses = new ArrayList<>();
        for (int i = messages.size() - 1; i >= 0; i--) {
            responses.add(mapToMessageResponse(messages.get(i)));
        }
        return responses;
    }

    /**
     * Mark messages as read
     */
    @Transactional
    public void markMessagesAsRead(String roomId, SenderType senderType) {
        chatMessageRepository.markAsRead(roomId, senderType);
    }

    /**
     * Count pending rooms
     */
    public long countPendingRooms() {
        return chatRoomRepository.countPendingRooms();
    }

    // ==================== Helper Methods ====================

    private ChatMessage saveMessage(String roomId, Integer senderId, SenderType senderType, 
                                   String content, MessageType messageType) {
        ChatMessage message = ChatMessage.builder()
            .roomId(roomId)
            .senderId(senderId)
            .senderType(senderType)
            .content(content)
            .messageType(messageType)
            .isRead(false)
            .build();
        
        return chatMessageRepository.save(message);
    }

    private ChatRoomResponse mapToRoomResponse(ChatRoom room) {
        User customer = userRepository.findById(room.getCustomerId()).orElse(null);
        User manager = room.getManagerId() != null ? 
            userRepository.findById(room.getManagerId()).orElse(null) : null;
        
        // Get last message
        List<ChatMessage> lastMessages = chatMessageRepository
            .findLatestMessageByRoomId(room.getId(), PageRequest.of(0, 1));
        ChatMessageResponse lastMessage = lastMessages.isEmpty() ? null : 
            mapToMessageResponse(lastMessages.get(0));
        
        // Count unread messages (from customer)
        long unreadCount = chatMessageRepository.countUnreadMessages(room.getId(), SenderType.CUSTOMER);
        
        // Determine if handler is support or manager based on role
        String managerName = null;
        String supportName = null;
        Integer supportId = null;
        
        if (manager != null) {
            String roleName = manager.getRole() != null ? manager.getRole().getName() : "";
            if ("SUPPORT".equals(roleName)) {
                supportId = room.getManagerId();
                supportName = manager.getFullName();
            } else {
                managerName = manager.getFullName();
            }
        }
        
        return ChatRoomResponse.builder()
            .id(room.getId())
            .customerId(room.getCustomerId())
            .customerName(customer != null ? customer.getFullName() : null)
            .managerId(room.getManagerId())
            .managerName(managerName)
            .supportId(supportId)
            .supportName(supportName)
            .roomType(room.getRoomType())
            .status(room.getStatus())
            .lastMessage(lastMessage)
            .unreadCount(unreadCount)
            .createdAt(room.getCreatedAt())
            .updatedAt(room.getUpdatedAt())
            .build();
    }

    private ChatMessageResponse mapToMessageResponse(ChatMessage message) {
        String senderName = null;
        String senderAvatar = null;
        
        if (message.getSenderId() != null) {
            User sender = userRepository.findById(message.getSenderId()).orElse(null);
            if (sender != null) {
                senderName = sender.getFullName();
                senderAvatar = sender.getAvatarUrl();
            }
        } else if (message.getSenderType() == SenderType.BOT) {
            senderName = "BeautyBot";
        } else if (message.getSenderType() == SenderType.SYSTEM) {
            senderName = "System";
        }
        
        // For support messages, show as support staff
        if (message.getSenderType() == SenderType.SUPPORT && senderName == null) {
            senderName = "Nhân viên tư vấn";
        }
        
        return ChatMessageResponse.builder()
            .id(message.getId())
            .roomId(message.getRoomId())
            .senderId(message.getSenderId())
            .senderName(senderName)
            .senderAvatar(senderAvatar)
            .senderType(message.getSenderType())
            .content(message.getContent())
            .messageType(message.getMessageType())
            .isRead(message.getIsRead())
            .createdAt(message.getCreatedAt())
            .build();
    }
}
