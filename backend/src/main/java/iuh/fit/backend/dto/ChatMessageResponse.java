package iuh.fit.backend.dto;

import java.time.LocalDateTime;

import iuh.fit.backend.model.enums.MessageType;
import iuh.fit.backend.model.enums.SenderType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatMessageResponse {
    private Integer id;
    private String roomId;
    private Integer senderId;
    private String senderName;
    private String senderAvatar;
    private SenderType senderType;
    private String content;
    private MessageType messageType;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
