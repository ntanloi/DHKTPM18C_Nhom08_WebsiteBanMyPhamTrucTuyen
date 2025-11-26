package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {
    private Integer id;
    private Integer productId;
    private String name;
    private String sku;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private List<VariantAttributeResponse> attributes;
}