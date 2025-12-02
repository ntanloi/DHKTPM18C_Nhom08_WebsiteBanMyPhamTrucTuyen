package iuh.fit.backend.dto;

import iuh.fit.backend.model.enums.ReturnStatus;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO for admin to process a return request
 */
@Data
public class ProcessReturnRequest {
    private ReturnStatus status;
    private BigDecimal refundAmount;
    private String adminNotes;
}
