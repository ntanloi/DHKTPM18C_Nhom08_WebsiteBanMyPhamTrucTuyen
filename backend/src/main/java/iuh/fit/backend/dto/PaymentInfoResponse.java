package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInfoResponse {
    private Integer id;
    private String paymentMethodName;
    private Double amount;
    private String status;
    private String transactionCode;
    private LocalDateTime createdAt;
}
