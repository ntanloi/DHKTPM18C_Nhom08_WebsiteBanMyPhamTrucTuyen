package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private Integer userId;
    private List<OrderItemRequest> orderItems;
    private String notes;
    private Integer couponId;
    private RecipientInfoRequest recipientInfo;
    private Integer paymentMethodId;
}
