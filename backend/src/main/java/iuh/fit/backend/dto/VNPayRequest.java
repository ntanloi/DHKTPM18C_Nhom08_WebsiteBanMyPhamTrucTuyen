package iuh.fit.backend.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class VNPayRequest {
    private Integer orderId;
    private BigDecimal amount;
    private String orderInfo;
    private String bankCode;
    private String language;
}
