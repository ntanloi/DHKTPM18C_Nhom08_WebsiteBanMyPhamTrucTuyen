package iuh.fit.backend.dto;

import iuh.fit.backend.model.enums.ItemCondition;
import iuh.fit.backend.model.enums.ReturnType;
import lombok.Data;

import java.util.List;

/**
 * DTO for creating a new return request
 */
@Data
public class CreateReturnRequest {
    private Integer orderId;
    private String reason;
    private ReturnType returnType;
    private String refundMethod;
    private String bankAccountNumber;
    private String bankName;
    private String accountHolderName;
    private List<ReturnItemRequest> items;
    private List<String> imageUrls;
    
    @Data
    public static class ReturnItemRequest {
        private Integer orderItemId;
        private Integer quantity;
        private String reason;
        private ItemCondition conditionStatus;
    }
}
