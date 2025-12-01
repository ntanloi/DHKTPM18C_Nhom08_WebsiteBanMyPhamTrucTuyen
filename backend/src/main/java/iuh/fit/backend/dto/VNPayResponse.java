package iuh.fit.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VNPayResponse {
    private String paymentUrl;
    private String transactionNo;
    private String orderId;
    private String message;
    private boolean success;
}
