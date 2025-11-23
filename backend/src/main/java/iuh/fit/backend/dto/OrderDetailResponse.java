package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailResponse {
    private Integer id;
    private Integer userId;
    private String status;
    private Double subtotal;
    private Double totalAmount;
    private Double discountAmount;
    private Double shippingFee;
    private String notes;
    private LocalDate estimateDeliveryFrom;
    private LocalDate estimateDeliveryTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemResponse> orderItems;
    private RecipientInfoResponse recipientInfo;
    private PaymentInfoResponse paymentInfo;
    private ShipmentInfoResponse shipmentInfo;

}
