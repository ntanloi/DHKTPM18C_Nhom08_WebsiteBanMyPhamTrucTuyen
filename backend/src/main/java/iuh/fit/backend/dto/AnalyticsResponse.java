package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * DTO for dashboard analytics response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    
    // Overview metrics
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private BigDecimal monthRevenue;
    private Long totalOrders;
    private Long todayOrders;
    private Long pendingOrders;
    private Long totalCustomers;
    private Long newCustomersToday;
    private Long totalProducts;
    private Long lowStockProducts;
    
    // Order status breakdown
    private Map<String, Long> ordersByStatus;
    
    // Revenue by period
    private List<RevenueData> revenueByDay;
    private List<RevenueData> revenueByMonth;
    
    // Top selling products
    private List<TopProductData> topSellingProducts;
    
    // Top customers
    private List<TopCustomerData> topCustomers;
    
    // Recent orders
    private List<RecentOrderData> recentOrders;
    
    // Category sales breakdown
    private List<CategorySalesData> salesByCategory;
    
    // Return statistics
    private Long totalReturns;
    private Long pendingReturns;
    private BigDecimal totalRefunded;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueData {
        private LocalDate date;
        private String period; // "2024-01" for monthly
        private BigDecimal revenue;
        private Long orderCount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProductData {
        private Integer productId;
        private String productName;
        private String productImage;
        private Long quantitySold;
        private BigDecimal totalRevenue;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopCustomerData {
        private Integer customerId;
        private String customerName;
        private String customerEmail;
        private Long orderCount;
        private BigDecimal totalSpent;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentOrderData {
        private Integer orderId;
        private String customerName;
        private BigDecimal totalAmount;
        private String status;
        private String createdAt;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategorySalesData {
        private Integer categoryId;
        private String categoryName;
        private Long productCount;
        private BigDecimal totalRevenue;
        private Double percentage;
    }
    
    /**
     * Dashboard summary for quick overview
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardSummary {
        private BigDecimal totalRevenue;
        private BigDecimal todayRevenue;
        private BigDecimal monthRevenue;
        private BigDecimal revenueGrowth; // Percentage growth compared to last period
        private Long totalOrders;
        private Long todayOrders;
        private Long pendingOrders;
        private Long totalCustomers;
        private Long newCustomersToday;
        private Long totalProducts;
        private Long lowStockProducts;
        private Long totalReturns;
        private Long pendingReturns;
        private Map<String, Long> ordersByStatus;
    }
    
    /**
     * Order statistics for analytics
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderStats {
        private Long totalOrders;
        private Long completedOrders;
        private Long pendingOrders;
        private Long cancelledOrders;
        private Long shippedOrders;
        private BigDecimal averageOrderValue;
        private BigDecimal totalRevenue;
        private Map<String, Long> ordersByStatus;
        private List<DailyOrderCount> dailyOrders;
    }
    
    /**
     * Daily order count for charts
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyOrderCount {
        private LocalDate date;
        private Long count;
    }
    
    /**
     * Product statistics for analytics
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductStats {
        private Long totalProducts;
        private Long activeProducts;
        private Long lowStockProducts;
        private Long outOfStockProducts;
        private List<TopProduct> topSellingProducts;
        private List<CategorySalesData> salesByCategory;
    }
    
    /**
     * Top product for analytics
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProduct {
        private Integer productId;
        private Integer variantId;
        private String productName;
        private String variantInfo;
        private String productImage;
        private Long quantitySold;
        private BigDecimal totalRevenue;
    }
    
    /**
     * User statistics for analytics
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStats {
        private Long totalUsers;
        private Long newUsers;
        private Long activeCustomers; // Users who made orders
        private Long returningCustomers; // Users with more than 1 order
        private BigDecimal averageCustomerSpend;
        private List<DailyUserCount> dailyRegistrations;
    }
    
    /**
     * Daily user registration count
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyUserCount {
        private LocalDate date;
        private Long count;
    }
    
    /**
     * Daily revenue for charts
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyRevenue {
        private LocalDate date;
        private BigDecimal revenue;
        private Long orderCount;
    }
}
