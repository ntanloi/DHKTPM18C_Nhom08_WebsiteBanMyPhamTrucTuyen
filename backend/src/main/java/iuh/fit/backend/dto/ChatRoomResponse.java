package iuh.fit.backend.dto;

import java.time.LocalDateTime;

import iuh.fit.backend.model.enums.RoomStatus;
import iuh.fit.backend.model.enums.RoomType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatRoomResponse {
    private String id;
    private Integer customerId;
    private String customerName;
    private Integer managerId;
    private String managerName;
    private Integer supportId;  // Support staff ID (alias for managerId when handled by support)
    private String supportName;
    private RoomType roomType;
    private RoomStatus status;
    private ChatMessageResponse lastMessage;
    private Long unreadCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
