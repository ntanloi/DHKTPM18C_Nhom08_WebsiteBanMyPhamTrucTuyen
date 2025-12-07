package iuh.fit.backend.service;

import iuh.fit.backend.dto.StockDTO.*;
import iuh.fit.backend.model.Product;
import iuh.fit.backend.model.ProductVariant;
import iuh.fit.backend.model.StockAlert;
import iuh.fit.backend.model.StockHistory;
import iuh.fit.backend.model.User;
import iuh.fit.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for stock management and alerts
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StockService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final StockHistoryRepository stockHistoryRepository;
    private final StockAlertRepository stockAlertRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private static final String ALERT_LOW_STOCK = "LOW_STOCK";
    private static final String ALERT_OUT_OF_STOCK = "OUT_OF_STOCK";
    private static final String SEVERITY_WARNING = "WARNING";
    private static final String SEVERITY_CRITICAL = "CRITICAL";

    /**
     * Adjust stock quantity for a variant
     */
    @Transactional
    public StockLevelResponse adjustStock(StockAdjustmentRequest request, Integer performedBy) {
        ProductVariant variant = productVariantRepository.findByIdForUpdate(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + request.getVariantId()));

        int previousQuantity = variant.getStockQuantity();
        int newQuantity;
        int quantityChange;

        switch (request.getAdjustmentType().toUpperCase()) {
            case "ADD":
                newQuantity = previousQuantity + request.getQuantity();
                quantityChange = request.getQuantity();
                break;
            case "SUBTRACT":
                newQuantity = previousQuantity - request.getQuantity();
                quantityChange = -request.getQuantity();
                if (newQuantity < 0) {
                    throw new RuntimeException("Insufficient stock. Current: " + previousQuantity + ", Requested: " + request.getQuantity());
                }
                break;
            case "SET":
                newQuantity = request.getQuantity();
                quantityChange = newQuantity - previousQuantity;
                break;
            default:
                throw new RuntimeException("Invalid adjustment type: " + request.getAdjustmentType());
        }

        // Update stock
        variant.setStockQuantity(newQuantity);
        productVariantRepository.save(variant);

        // Record history
        recordStockHistory(variant.getId(), previousQuantity, newQuantity, quantityChange,
                request.getAdjustmentType(), request.getReason(),
                request.getReferenceType(), request.getReferenceId(), performedBy);

        // Check and update alerts
        checkAndUpdateStockAlert(variant);

        log.info("Stock adjusted for variant {}: {} -> {} ({}{})", 
                variant.getId(), previousQuantity, newQuantity,
                quantityChange >= 0 ? "+" : "", quantityChange);

        return buildStockLevelResponse(variant);
    }

    /**
     * Batch stock update
     */
    @Transactional
    public List<StockLevelResponse> batchAdjustStock(BatchStockUpdateRequest request, Integer performedBy) {
        return request.getAdjustments().stream()
                .map(adjustment -> adjustStock(adjustment, performedBy))
                .collect(Collectors.toList());
    }

    /**
     * Get stock level for a variant
     */
    public StockLevelResponse getStockLevel(Integer variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + variantId));
        return buildStockLevelResponse(variant);
    }

    /**
     * Get all stock levels
     */
    public List<StockLevelResponse> getAllStockLevels() {
        return productVariantRepository.findAll().stream()
                .map(this::buildStockLevelResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get low stock variants
     */
    public List<StockLevelResponse> getLowStockVariants() {
        return productVariantRepository.findAll().stream()
                .filter(v -> v.getStockQuantity() <= v.getLowStockThreshold())
                .map(this::buildStockLevelResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get out of stock variants
     */
    public List<StockLevelResponse> getOutOfStockVariants() {
        return productVariantRepository.findAll().stream()
                .filter(v -> v.getStockQuantity() == 0)
                .map(this::buildStockLevelResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get stock summary
     */
    public StockSummaryResponse getStockSummary() {
        List<ProductVariant> allVariants = productVariantRepository.findAll();
        
        long inStock = allVariants.stream()
                .filter(v -> v.getStockQuantity() > v.getLowStockThreshold())
                .count();
        
        long lowStock = allVariants.stream()
                .filter(v -> v.getStockQuantity() > 0 && v.getStockQuantity() <= v.getLowStockThreshold())
                .count();
        
        long outOfStock = allVariants.stream()
                .filter(v -> v.getStockQuantity() == 0)
                .count();

        BigDecimal totalValue = allVariants.stream()
                .map(v -> v.getPrice().multiply(BigDecimal.valueOf(v.getStockQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<StockAlertResponse> alerts = getActiveAlerts();

        return StockSummaryResponse.builder()
                .totalVariants((long) allVariants.size())
                .inStockCount(inStock)
                .lowStockCount(lowStock)
                .outOfStockCount(outOfStock)
                .totalInventoryValue(totalValue)
                .alerts(alerts)
                .build();
    }

    /**
     * Get active stock alerts
     */
    public List<StockAlertResponse> getActiveAlerts() {
        return stockAlertRepository.findActiveAlertsWithVariant().stream()
                .map(this::buildAlertResponse)
                .collect(Collectors.toList());
    }

    /**
     * Acknowledge stock alert
     */
    @Transactional
    public void acknowledgeAlert(Integer alertId, Integer userId) {
        StockAlert alert = stockAlertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + alertId));
        
        alert.setAcknowledged(true);
        alert.setAcknowledgedBy(userId);
        alert.setAcknowledgedAt(LocalDateTime.now());
        stockAlertRepository.save(alert);
        
        log.info("Alert {} acknowledged by user {}", alertId, userId);
    }

    /**
     * Acknowledge multiple alerts
     */
    @Transactional
    public void acknowledgeAlerts(List<Integer> alertIds, Integer userId) {
        stockAlertRepository.acknowledgeAlerts(alertIds, userId);
        log.info("Acknowledged {} alerts by user {}", alertIds.size(), userId);
    }

    /**
     * Get stock history for a variant
     */
    public List<StockHistoryEntry> getStockHistory(Integer variantId) {
        return stockHistoryRepository.findByVariantIdOrderByCreatedAtDesc(variantId).stream()
                .map(this::buildHistoryEntry)
                .collect(Collectors.toList());
    }

    /**
     * Get recent stock history
     */
    public List<StockHistoryEntry> getRecentHistory(int limit) {
        return stockHistoryRepository.findRecentHistory(PageRequest.of(0, limit)).stream()
                .map(this::buildHistoryEntry)
                .collect(Collectors.toList());
    }

    /**
     * Update stock threshold for a variant
     */
    @Transactional
    public StockLevelResponse updateThreshold(StockThresholdRequest request) {
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + request.getVariantId()));

        if (request.getLowStockThreshold() != null) {
            variant.setLowStockThreshold(request.getLowStockThreshold());
        }
        if (request.getReorderPoint() != null) {
            variant.setReorderPoint(request.getReorderPoint());
        }
        if (request.getReorderQuantity() != null) {
            variant.setReorderQuantity(request.getReorderQuantity());
        }

        productVariantRepository.save(variant);

        // Re-check alerts with new threshold
        checkAndUpdateStockAlert(variant);

        return buildStockLevelResponse(variant);
    }

    /**
     * Check stock levels and refresh all alerts
     */
    @Transactional
    public void refreshAllAlerts() {
        List<ProductVariant> allVariants = productVariantRepository.findAll();
        for (ProductVariant variant : allVariants) {
            checkAndUpdateStockAlert(variant);
        }
        log.info("Refreshed stock alerts for {} variants", allVariants.size());
    }

    // ==================== Private Helper Methods ====================

    private void recordStockHistory(Integer variantId, int previousQty, int newQty, int change,
                                     String adjustmentType, String reason,
                                     String referenceType, Integer referenceId, Integer performedBy) {
        StockHistory history = StockHistory.builder()
                .variantId(variantId)
                .previousQuantity(previousQty)
                .newQuantity(newQty)
                .quantityChange(change)
                .adjustmentType(adjustmentType.toUpperCase())
                .reason(reason)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .performedBy(performedBy)
                .build();
        
        stockHistoryRepository.save(history);
    }

    private void checkAndUpdateStockAlert(ProductVariant variant) {
        Optional<StockAlert> existingAlert = stockAlertRepository.findByVariantId(variant.getId());
        
        if (variant.getStockQuantity() == 0) {
            // Create or update OUT_OF_STOCK alert (CRITICAL)
            StockAlert alert = existingAlert.orElse(new StockAlert());
            alert.setVariantId(variant.getId());
            alert.setAlertType(ALERT_OUT_OF_STOCK);
            alert.setSeverity(SEVERITY_CRITICAL);
            alert.setCurrentStock(0);
            alert.setThreshold(variant.getLowStockThreshold());
            alert.setAcknowledged(false);
            stockAlertRepository.save(alert);
            
            // Send notification
            sendStockAlertNotification(variant, ALERT_OUT_OF_STOCK);
            
        } else if (variant.getStockQuantity() <= variant.getLowStockThreshold()) {
            // Create or update LOW_STOCK alert (WARNING)
            StockAlert alert = existingAlert.orElse(new StockAlert());
            alert.setVariantId(variant.getId());
            alert.setAlertType(ALERT_LOW_STOCK);
            alert.setSeverity(SEVERITY_WARNING);
            alert.setCurrentStock(variant.getStockQuantity());
            alert.setThreshold(variant.getLowStockThreshold());
            alert.setAcknowledged(false);
            stockAlertRepository.save(alert);
            
            // Send notification
            sendStockAlertNotification(variant, ALERT_LOW_STOCK);
            
        } else {
            // Remove alert if stock is healthy
            existingAlert.ifPresent(alert -> stockAlertRepository.deleteByVariantId(variant.getId()));
        }
    }

    private void sendStockAlertNotification(ProductVariant variant, String alertType) {
        try {
            String productName = "Unknown";
            if (variant.getProduct() != null) {
                productName = variant.getProduct().getName();
            } else {
                Optional<Product> product = productRepository.findById(variant.getProductId());
                productName = product.map(Product::getName).orElse("Unknown");
            }

            // Use dedicated notifyLowStock method for better notification structure
            notificationService.notifyLowStock(
                variant.getProductId(), 
                productName + " - " + variant.getName() + " (SKU: " + variant.getSku() + ")",
                variant.getStockQuantity()
            );
            
            log.info("Stock alert notification sent for variant {}: {} - {} units", 
                    variant.getId(), productName, variant.getStockQuantity());
        } catch (Exception e) {
            log.error("Failed to send stock alert notification: {}", e.getMessage());
        }
    }

    private StockLevelResponse buildStockLevelResponse(ProductVariant variant) {
        String productName = "Unknown";
        if (variant.getProduct() != null) {
            productName = variant.getProduct().getName();
        } else {
            productName = productRepository.findById(variant.getProductId())
                    .map(Product::getName).orElse("Unknown");
        }

        String status;
        if (variant.getStockQuantity() == 0) {
            status = "OUT_OF_STOCK";
        } else if (variant.getStockQuantity() <= variant.getLowStockThreshold()) {
            status = "LOW_STOCK";
        } else {
            status = "IN_STOCK";
        }

        return StockLevelResponse.builder()
                .variantId(variant.getId())
                .sku(variant.getSku())
                .productName(productName)
                .variantName(variant.getName())
                .currentStock(variant.getStockQuantity())
                .lowStockThreshold(variant.getLowStockThreshold())
                .stockStatus(status)
                .price(variant.getPrice())
                .salePrice(variant.getSalePrice())
                .build();
    }

    private StockAlertResponse buildAlertResponse(StockAlert alert) {
        ProductVariant variant = alert.getVariant();
        String productName = "Unknown";
        
        if (variant != null && variant.getProduct() != null) {
            productName = variant.getProduct().getName();
        } else if (variant != null) {
            productName = productRepository.findById(variant.getProductId())
                    .map(Product::getName).orElse("Unknown");
        }

        return StockAlertResponse.builder()
                .variantId(alert.getVariantId())
                .sku(variant != null ? variant.getSku() : "N/A")
                .productName(productName)
                .variantName(variant != null ? variant.getName() : "N/A")
                .currentStock(alert.getCurrentStock())
                .threshold(alert.getThreshold())
                .alertType(alert.getAlertType())
                .severity(alert.getSeverity())
                .createdAt(alert.getCreatedAt())
                .build();
    }

    private StockHistoryEntry buildHistoryEntry(StockHistory history) {
        String performerName = null;
        if (history.getPerformer() != null) {
            performerName = history.getPerformer().getFullName();
        } else if (history.getPerformedBy() != null) {
            performerName = userRepository.findById(history.getPerformedBy())
                    .map(User::getFullName).orElse("Unknown");
        }

        String sku = null;
        if (history.getVariant() != null) {
            sku = history.getVariant().getSku();
        } else {
            sku = productVariantRepository.findById(history.getVariantId())
                    .map(ProductVariant::getSku).orElse("N/A");
        }

        return StockHistoryEntry.builder()
                .id(history.getId())
                .variantId(history.getVariantId())
                .sku(sku)
                .previousQuantity(history.getPreviousQuantity())
                .newQuantity(history.getNewQuantity())
                .quantityChange(history.getQuantityChange())
                .adjustmentType(history.getAdjustmentType())
                .reason(history.getReason())
                .referenceType(history.getReferenceType())
                .referenceId(history.getReferenceId())
                .performedBy(history.getPerformedBy())
                .performedByName(performerName)
                .createdAt(history.getCreatedAt())
                .build();
    }
}
