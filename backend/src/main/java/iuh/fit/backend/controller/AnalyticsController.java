package iuh.fit.backend.controller;

import iuh.fit.backend.dto.AnalyticsResponse.*;
import iuh.fit.backend.service.AnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST Controller for admin analytics dashboard.
 * Provides comprehensive business intelligence endpoints.
 */
@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * Get dashboard summary with key metrics
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummary> getDashboardSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    /**
     * Get revenue data within date range
     */
    @GetMapping("/revenue")
    public ResponseEntity<RevenueData> getRevenueByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(analyticsService.getRevenueByDateRange(startDate, endDate));
    }

    /**
     * Get order statistics within date range
     */
    @GetMapping("/orders")
    public ResponseEntity<OrderStats> getOrderStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(analyticsService.getOrderStatistics(startDate, endDate));
    }

    /**
     * Get product performance data within date range
     */
    @GetMapping("/products")
    public ResponseEntity<ProductStats> getProductStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "10") int topCount) {
        return ResponseEntity.ok(analyticsService.getProductStatistics(startDate, endDate, topCount));
    }

    /**
     * Get user statistics within date range
     */
    @GetMapping("/users")
    public ResponseEntity<UserStats> getUserStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(analyticsService.getUserStatistics(startDate, endDate));
    }

    /**
     * Get top selling products
     */
    @GetMapping("/top-products")
    public ResponseEntity<List<TopProduct>> getTopSellingProducts(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(analyticsService.getTopSellingProducts(startDate, endDate, limit));
    }

    /**
     * Get daily revenue for chart visualization
     */
    @GetMapping("/daily-revenue")
    public ResponseEntity<List<DailyRevenue>> getDailyRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(analyticsService.getDailyRevenue(startDate, endDate));
    }
}
