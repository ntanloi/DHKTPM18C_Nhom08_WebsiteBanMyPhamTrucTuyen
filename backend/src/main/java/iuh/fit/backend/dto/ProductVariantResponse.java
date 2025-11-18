package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {
    private Integer id;
    private Integer productId;
    private String name;
    private String sku;
    private Double price;
    private Double salePrice;
    private Integer stockQuantity;
    private List<VariantAttributeResponse> attributes;
}