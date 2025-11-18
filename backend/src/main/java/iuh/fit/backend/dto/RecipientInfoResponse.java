package iuh.fit.backend.dto;

import iuh.fit.backend.model.User;
import iuh.fit.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipientInfoResponse {
    private String recipientFirstName;
    private String recipientLastName;
    private String recipientPhone;
    private String recipientEmail;
    private String shippingRecipientAddress;
    private Boolean isAnotherReceiver;
}
