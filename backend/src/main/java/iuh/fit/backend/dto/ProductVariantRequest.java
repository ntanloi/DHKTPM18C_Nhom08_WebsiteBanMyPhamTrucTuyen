package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantRequest {
    private Integer productId;
    private String name;
    private String sku;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stockQuantity;
}