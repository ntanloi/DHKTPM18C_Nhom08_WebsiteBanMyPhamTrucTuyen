package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipientInfoRequest {
    private String recipientFirstName;
    private String recipientLastName;
    private String recipientPhone;
    private String recipientEmail;
    private String shippingRecipientAddress;
    private Boolean isAnotherReceiver;
}
