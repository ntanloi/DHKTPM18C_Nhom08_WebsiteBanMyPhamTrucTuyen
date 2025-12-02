package iuh.fit.backend.controller;

import iuh.fit.backend.dto.StockDTO.*;
import iuh.fit.backend.security.CustomUserDetails;
import iuh.fit.backend.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for stock management operations
 */
@RestController
@RequestMapping("/api/admin/stock")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    /**
     * Get stock summary with overview metrics
     */
    @GetMapping("/summary")
    public ResponseEntity<StockSummaryResponse> getStockSummary() {
        return ResponseEntity.ok(stockService.getStockSummary());
    }

    /**
     * Get all stock levels
     */
    @GetMapping("/levels")
    public ResponseEntity<List<StockLevelResponse>> getAllStockLevels() {
        return ResponseEntity.ok(stockService.getAllStockLevels());
    }

    /**
     * Get stock level for a specific variant
     */
    @GetMapping("/levels/{variantId}")
    public ResponseEntity<StockLevelResponse> getStockLevel(@PathVariable Integer variantId) {
        return ResponseEntity.ok(stockService.getStockLevel(variantId));
    }

    /**
     * Get low stock variants
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<StockLevelResponse>> getLowStockVariants() {
        return ResponseEntity.ok(stockService.getLowStockVariants());
    }

    /**
     * Get out of stock variants
     */
    @GetMapping("/out-of-stock")
    public ResponseEntity<List<StockLevelResponse>> getOutOfStockVariants() {
        return ResponseEntity.ok(stockService.getOutOfStockVariants());
    }

    /**
     * Adjust stock for a variant
     */
    @PostMapping("/adjust")
    public ResponseEntity<StockLevelResponse> adjustStock(
            @RequestBody StockAdjustmentRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(stockService.adjustStock(request, userDetails.getId()));
    }

    /**
     * Batch stock update
     */
    @PostMapping("/batch-adjust")
    public ResponseEntity<List<StockLevelResponse>> batchAdjustStock(
            @RequestBody BatchStockUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(stockService.batchAdjustStock(request, userDetails.getId()));
    }

    /**
     * Update stock threshold for a variant
     */
    @PutMapping("/threshold")
    public ResponseEntity<StockLevelResponse> updateThreshold(@RequestBody StockThresholdRequest request) {
        return ResponseEntity.ok(stockService.updateThreshold(request));
    }

    /**
     * Get active stock alerts
     */
    @GetMapping("/alerts")
    public ResponseEntity<List<StockAlertResponse>> getActiveAlerts() {
        return ResponseEntity.ok(stockService.getActiveAlerts());
    }

    /**
     * Acknowledge a single stock alert
     */
    @PostMapping("/alerts/{alertId}/acknowledge")
    public ResponseEntity<Map<String, String>> acknowledgeAlert(
            @PathVariable Integer alertId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        stockService.acknowledgeAlert(alertId, userDetails.getId());
        return ResponseEntity.ok(Map.of("message", "Alert acknowledged successfully"));
    }

    /**
     * Acknowledge multiple alerts
     */
    @PostMapping("/alerts/acknowledge")
    public ResponseEntity<Map<String, String>> acknowledgeAlerts(
            @RequestBody List<Integer> alertIds,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        stockService.acknowledgeAlerts(alertIds, userDetails.getId());
        return ResponseEntity.ok(Map.of("message", alertIds.size() + " alerts acknowledged successfully"));
    }

    /**
     * Get stock history for a variant
     */
    @GetMapping("/history/{variantId}")
    public ResponseEntity<List<StockHistoryEntry>> getStockHistory(@PathVariable Integer variantId) {
        return ResponseEntity.ok(stockService.getStockHistory(variantId));
    }

    /**
     * Get recent stock history
     */
    @GetMapping("/history")
    public ResponseEntity<List<StockHistoryEntry>> getRecentHistory(
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(stockService.getRecentHistory(limit));
    }

    /**
     * Refresh all stock alerts
     */
    @PostMapping("/alerts/refresh")
    public ResponseEntity<Map<String, String>> refreshAlerts() {
        stockService.refreshAllAlerts();
        return ResponseEntity.ok(Map.of("message", "Stock alerts refreshed successfully"));
    }
}
