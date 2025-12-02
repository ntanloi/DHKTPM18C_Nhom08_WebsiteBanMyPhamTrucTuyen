package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTOs for stock management and alerts
 */
public class StockDTO {

    /**
     * Request to adjust stock quantity
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockAdjustmentRequest {
        private Integer variantId;
        private Integer quantity;
        private String adjustmentType; // ADD, SUBTRACT, SET
        private String reason;
        private String referenceType; // ORDER, RETURN, MANUAL, INVENTORY_CHECK
        private Integer referenceId;
    }

    /**
     * Batch stock update request
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchStockUpdateRequest {
        private List<StockAdjustmentRequest> adjustments;
    }

    /**
     * Stock level response
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockLevelResponse {
        private Integer variantId;
        private String sku;
        private String productName;
        private String variantName;
        private Integer currentStock;
        private Integer lowStockThreshold;
        private String stockStatus; // IN_STOCK, LOW_STOCK, OUT_OF_STOCK
        private BigDecimal price;
        private BigDecimal salePrice;
        private LocalDateTime lastUpdated;
    }

    /**
     * Stock alert response
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockAlertResponse {
        private Integer variantId;
        private String sku;
        private String productName;
        private String variantName;
        private Integer currentStock;
        private Integer threshold;
        private String alertType; // LOW_STOCK, OUT_OF_STOCK
        private String severity; // WARNING, CRITICAL
        private LocalDateTime createdAt;
    }

    /**
     * Stock history entry
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockHistoryEntry {
        private Integer id;
        private Integer variantId;
        private String sku;
        private Integer previousQuantity;
        private Integer newQuantity;
        private Integer quantityChange;
        private String adjustmentType;
        private String reason;
        private String referenceType;
        private Integer referenceId;
        private Integer performedBy;
        private String performedByName;
        private LocalDateTime createdAt;
    }

    /**
     * Stock summary response
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockSummaryResponse {
        private Long totalVariants;
        private Long inStockCount;
        private Long lowStockCount;
        private Long outOfStockCount;
        private BigDecimal totalInventoryValue;
        private List<StockAlertResponse> alerts;
    }

    /**
     * Stock threshold configuration
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockThresholdRequest {
        private Integer variantId;
        private Integer lowStockThreshold;
        private Integer reorderPoint;
        private Integer reorderQuantity;
    }
}
