package iuh.fit.backend.controller;

import iuh.fit.backend.dto.AnalyticsResponse.*;
import iuh.fit.backend.service.AnalyticsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

    /**
     * Export dashboard data to CSV file
     */
    @GetMapping("/export/csv")
    public void exportDashboardToCsv(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            HttpServletResponse response) throws IOException {
        
        response.setContentType("text/csv; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-Disposition", 
            "attachment; filename=analytics_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".csv");

        PrintWriter writer = response.getWriter();
        
        // Write BOM for UTF-8 Excel compatibility
        writer.write('\ufeff');
        
        // Get data
        DashboardSummary summary = analyticsService.getDashboardSummary();
        OrderStats orderStats = analyticsService.getOrderStatistics(startDate, endDate);
        List<TopProduct> topProducts = analyticsService.getTopSellingProducts(startDate, endDate, 10);
        
        // Dashboard Summary
        writer.println("=== TỔNG QUAN ===");
        writer.println("Chỉ số,Giá trị,Tăng trưởng (%)");
        writer.println("Tổng doanh thu," + summary.getTotalRevenue() + "," + summary.getRevenueGrowth());
        writer.println("Tổng đơn hàng," + summary.getTotalOrders() + ",");
        writer.println("Tổng sản phẩm," + summary.getTotalProducts() + ",");
        writer.println("Tổng khách hàng," + summary.getTotalCustomers() + ",");
        writer.println();
        
        // Order Statistics
        writer.println("=== THỐNG KÊ ĐƠN HÀNG ===");
        writer.println("Trạng thái,Số lượng");
        orderStats.getOrdersByStatus().forEach((status, count) -> 
            writer.println(status + "," + count));
        writer.println();
        
        // Top Products
        writer.println("=== TOP SẢN PHẨM BÁN CHẠY ===");
        writer.println("Xếp hạng,Tên sản phẩm,Số lượng đã bán,Doanh thu");
        int rank = 1;
        for (TopProduct product : topProducts) {
            writer.println(rank++ + "," + 
                escapeCsv(product.getProductName()) + "," + 
                product.getQuantitySold() + "," + 
                product.getTotalRevenue());
        }
        
        writer.flush();
    }

    /**
     * Helper method to escape CSV special characters
     */
    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
