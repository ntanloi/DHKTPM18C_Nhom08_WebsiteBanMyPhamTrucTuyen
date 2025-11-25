package iuh.fit.backend.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteListResponse {
    private Integer id;
    private Integer userId;
    private Integer productId;
    private String productName;
    private String productSlug;
    private String productImageUrl;
    private BigDecimal productPrice;
    private BigDecimal productSalePrice;
}