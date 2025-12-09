package iuh.fit.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class MergeCartRequest {
    private List<CartItemData> guestCartItems;

    @Data
    public static class CartItemData {
        private Integer productVariantId;
        private Integer quantity;
    }
}
