package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponResponse {
    private Integer id;
    private String code;
    private String description;
    private Boolean isActive;
    private String discountType;
    private Double discountValue;
    private Double minOrderValue;
    private Integer maxUsageValue;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private Integer createdByUserId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
