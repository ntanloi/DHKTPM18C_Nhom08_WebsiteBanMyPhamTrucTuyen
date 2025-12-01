package iuh.fit.backend.dto;

import iuh.fit.backend.model.enums.ItemCondition;
import iuh.fit.backend.model.enums.ReturnStatus;
import iuh.fit.backend.model.enums.ReturnType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for return response
 */
@Data
public class ReturnResponse {
    private Integer id;
    private Integer orderId;
    private String reason;
    private ReturnStatus status;
    private ReturnType returnType;
    private BigDecimal refundAmount;
    private String refundMethod;
    private String bankAccountNumber;
    private String bankName;
    private String accountHolderName;
    private String adminNotes;
    private Integer processedBy;
    private String processorName;
    private LocalDateTime processedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Order info
    private String orderStatus;
    private BigDecimal orderTotal;
    private Integer customerId;
    private String customerName;
    private String customerEmail;
    
    private List<ReturnItemResponse> items;
    private List<ReturnImageResponse> images;
    
    @Data
    public static class ReturnItemResponse {
        private Integer id;
        private Integer orderItemId;
        private Integer quantity;
        private String reason;
        private ItemCondition conditionStatus;
        // Product info from order item
        private String productName;
        private String variantName;
        private BigDecimal price;
        private String imageUrl;
    }
    
    @Data
    public static class ReturnImageResponse {
        private Integer id;
        private String imageUrl;
        private String description;
        private LocalDateTime createdAt;
    }
}
