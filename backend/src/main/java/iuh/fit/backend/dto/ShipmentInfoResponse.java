package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentInfoResponse {
    private Integer id;
    private String status;
    private String trackingCode;
    private String shippingProviderName;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
}
