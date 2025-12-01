package iuh.fit.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import iuh.fit.backend.model.ChatMessage;
import iuh.fit.backend.model.enums.SenderType;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    // Get paginated messages by room
    Page<ChatMessage> findByRoomIdOrderByCreatedAtDesc(String roomId, Pageable pageable);
    
    // Get all messages in a room
    List<ChatMessage> findByRoomIdOrderByCreatedAtAsc(String roomId);
    
    // Get latest message in a room
    @Query("SELECT m FROM ChatMessage m WHERE m.roomId = :roomId ORDER BY m.createdAt DESC")
    List<ChatMessage> findLatestMessageByRoomId(@Param("roomId") String roomId, Pageable pageable);
    
    // Count unread messages
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.roomId = :roomId AND m.isRead = false AND m.senderType = :senderType")
    long countUnreadMessages(@Param("roomId") String roomId, @Param("senderType") SenderType senderType);
    
    // Mark messages as read
    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.roomId = :roomId AND m.senderType = :senderType AND m.isRead = false")
    void markAsRead(@Param("roomId") String roomId, @Param("senderType") SenderType senderType);
}
