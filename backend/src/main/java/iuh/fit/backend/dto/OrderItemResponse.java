package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Integer id;
    private Integer productVariantId;
    private String productName;
    private String variantName;
    private Integer quantity;
    private Double price;
    private Double subtotal;
}
