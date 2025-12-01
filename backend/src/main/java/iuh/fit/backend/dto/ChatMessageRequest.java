package iuh.fit.backend.dto;

import iuh.fit.backend.model.enums.MessageType;
import lombok.Data;

@Data
public class ChatMessageRequest {
    private String roomId;
    private String content;
    private MessageType messageType = MessageType.TEXT; 
}
