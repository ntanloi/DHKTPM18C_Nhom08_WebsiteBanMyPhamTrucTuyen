package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethodResponse {
    private Integer id;
    private String name;
    private String code;
    private String description;
    private String icon;
    private Boolean isActive;
    private Boolean isRecommended;
    private Integer sortOrder;
}
