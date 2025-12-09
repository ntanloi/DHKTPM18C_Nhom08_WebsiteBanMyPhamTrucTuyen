package iuh.fit.backend.service;

import iuh.fit.backend.dto.AnalyticsResponse;
import iuh.fit.backend.dto.AnalyticsResponse.*;
import iuh.fit.backend.model.enums.ReturnStatus;
import iuh.fit.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for generating dashboard analytics and statistics
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CategoryRepository categoryRepository;
    private final ReturnRepository returnRepository;

    /**
     * Get complete dashboard analytics
     */
    public AnalyticsResponse getDashboardAnalytics() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();
        LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();

        return AnalyticsResponse.builder()
                // Overview metrics
                .totalRevenue(getTotalRevenue())
                .todayRevenue(getRevenueForPeriod(startOfDay, endOfDay))
                .monthRevenue(getRevenueForPeriod(startOfMonth, endOfDay))
                .totalOrders(orderRepository.count())
                .todayOrders(getOrderCountForPeriod(startOfDay, endOfDay))
                .pendingOrders(orderRepository.countByStatus("PENDING"))
                .totalCustomers(getTotalCustomers())
                .newCustomersToday(getNewCustomersForPeriod(startOfDay, endOfDay))
                .totalProducts(productRepository.count())
                .lowStockProducts(getLowStockProductCount())
                
                // Order breakdown
                .ordersByStatus(getOrdersByStatus())
                
                // Revenue data
                .revenueByDay(getRevenueByDay(30))
                .revenueByMonth(getRevenueByMonth(12))
                
                // Top data
                .topSellingProducts(getTopSellingProducts(10))
                .topCustomers(getTopCustomers(10))
                .recentOrders(getRecentOrders(10))
                .salesByCategory(getSalesByCategory())
                
                // Return stats
                .totalReturns(returnRepository.count())
                .pendingReturns(returnRepository.countByStatus(ReturnStatus.PENDING))
                .totalRefunded(getTotalRefunded())
                .build();
    }

    /**
     * Get total revenue from completed orders
     * Include CONFIRMED, PROCESSING, SHIPPED, DELIVERED statuses
     */
    public BigDecimal getTotalRevenue() {
        List<String> completedStatuses = List.of("CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED");
        BigDecimal total = orderRepository.sumTotalAmountByStatusIn(completedStatuses);
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * Get revenue for a specific period
     */
    public BigDecimal getRevenueForPeriod(LocalDateTime start, LocalDateTime end) {
        BigDecimal revenue = orderRepository.sumTotalAmountByCreatedAtBetween(start, end);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    /**
     * Get order count for a specific period
     */
    public Long getOrderCountForPeriod(LocalDateTime start, LocalDateTime end) {
        return orderRepository.countByCreatedAtBetween(start, end);
    }

    /**
     * Get total unique customers (users with orders)
     */
    public Long getTotalCustomers() {
        return orderRepository.countDistinctUserId();
    }

    /**
     * Get new customers for a period
     */
    public Long getNewCustomersForPeriod(LocalDateTime start, LocalDateTime end) {
        return userRepository.countByCreatedAtBetween(start, end);
    }

    /**
     * Get count of products with low stock (< 10 units)
     */
    public Long getLowStockProductCount() {
        return productVariantRepository.countByStockQuantityLessThan(10);
    }

    /**
     * Get orders grouped by status
     */
    public Map<String, Long> getOrdersByStatus() {
        Map<String, Long> result = new HashMap<>();
        List<Object[]> statusCounts = orderRepository.countGroupByStatus();
        for (Object[] row : statusCounts) {
            result.put((String) row[0], (Long) row[1]);
        }
        return result;
    }

    /**
     * Get daily revenue for last N days
     */
    public List<AnalyticsResponse.RevenueData> getRevenueByDay(int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);
        
        List<Object[]> dailyData = orderRepository.getRevenueByDay(
                startDate.atStartOfDay(), 
                endDate.plusDays(1).atStartOfDay()
        );
        
        return dailyData.stream()
                .map(row -> AnalyticsResponse.RevenueData.builder()
                        .date(((java.sql.Date) row[0]).toLocalDate())
                        .revenue((BigDecimal) row[1])
                        .orderCount((Long) row[2])
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Get monthly revenue for last N months
     */
    public List<AnalyticsResponse.RevenueData> getRevenueByMonth(int months) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(months).withDayOfMonth(1);
        
        List<Object[]> monthlyData = orderRepository.getRevenueByMonth(
                startDate.atStartOfDay(), 
                endDate.plusDays(1).atStartOfDay()
        );
        
        return monthlyData.stream()
                .map(row -> AnalyticsResponse.RevenueData.builder()
                        .period((String) row[0])
                        .revenue((BigDecimal) row[1])
                        .orderCount((Long) row[2])
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Get top selling products
     */
    public List<AnalyticsResponse.TopProductData> getTopSellingProducts(int limit) {
        List<Object[]> topProducts = orderItemRepository.getTopSellingProducts(limit);
        
        return topProducts.stream()
                .map(row -> AnalyticsResponse.TopProductData.builder()
                        .productId((Integer) row[0])
                        .productName((String) row[1])
                        .quantitySold((Long) row[2])
                        .totalRevenue((BigDecimal) row[3])
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Get top customers by spending
     */
    public List<AnalyticsResponse.TopCustomerData> getTopCustomers(int limit) {
        List<Object[]> topCustomers = orderRepository.getTopCustomers(limit);
        
        return topCustomers.stream()
                .map(row -> AnalyticsResponse.TopCustomerData.builder()
                        .customerId((Integer) row[0])
                        .customerName((String) row[1])
                        .customerEmail((String) row[2])
                        .orderCount((Long) row[3])
                        .totalSpent((BigDecimal) row[4])
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Get recent orders
     */
    public List<AnalyticsResponse.RecentOrderData> getRecentOrders(int limit) {
        return orderRepository.findTopByOrderByCreatedAtDesc(limit).stream()
                .map(order -> AnalyticsResponse.RecentOrderData.builder()
                        .orderId(order.getId())
                        .customerName(order.getUser() != null ? order.getUser().getFullName() : "Unknown")
                        .totalAmount(order.getTotalAmount())
                        .status(order.getStatus())
                        .createdAt(order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Get sales breakdown by category
     */
    public List<AnalyticsResponse.CategorySalesData> getSalesByCategory() {
        List<Object[]> categorySales = orderItemRepository.getSalesByCategory();
        
        BigDecimal totalSales = categorySales.stream()
                .map(row -> (BigDecimal) row[2])
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return categorySales.stream()
                .map(row -> {
                    BigDecimal categoryRevenue = (BigDecimal) row[2];
                    Double percentage = totalSales.compareTo(BigDecimal.ZERO) > 0 
                            ? categoryRevenue.divide(totalSales, 4, RoundingMode.HALF_UP)
                                    .multiply(BigDecimal.valueOf(100)).doubleValue()
                            : 0.0;
                    
                    return AnalyticsResponse.CategorySalesData.builder()
                            .categoryId((Integer) row[0])
                            .categoryName((String) row[1])
                            .totalRevenue(categoryRevenue)
                            .percentage(percentage)
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Get total refunded amount
     */
    public BigDecimal getTotalRefunded() {
        BigDecimal total = returnRepository.sumRefundAmount();
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * Get analytics for a specific date range
     */
    public AnalyticsResponse getAnalyticsForPeriod(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.plusDays(1).atStartOfDay();

        return AnalyticsResponse.builder()
                .totalRevenue(getRevenueForPeriod(start, end))
                .totalOrders(getOrderCountForPeriod(start, end))
                .newCustomersToday(getNewCustomersForPeriod(start, end))
                .build();
    }

    // ==================== Controller-facing Methods ====================

    /**
     * Get dashboard summary for admin overview
     */
    public DashboardSummary getDashboardSummary() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();
        LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime startOfLastMonth = today.minusMonths(1).withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfLastMonth = today.withDayOfMonth(1).atStartOfDay();

        // Calculate revenue growth
        BigDecimal currentMonthRevenue = getRevenueForPeriod(startOfMonth, endOfDay);
        BigDecimal lastMonthRevenue = getRevenueForPeriod(startOfLastMonth, endOfLastMonth);
        BigDecimal revenueGrowth = BigDecimal.ZERO;
        if (lastMonthRevenue.compareTo(BigDecimal.ZERO) > 0) {
            revenueGrowth = currentMonthRevenue.subtract(lastMonthRevenue)
                    .divide(lastMonthRevenue, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        // Calculate orders growth
        Long currentMonthOrders = getOrderCountForPeriod(startOfMonth, endOfDay);
        Long lastMonthOrders = getOrderCountForPeriod(startOfLastMonth, endOfLastMonth);
        BigDecimal ordersGrowth = BigDecimal.ZERO;
        if (lastMonthOrders > 0) {
            ordersGrowth = BigDecimal.valueOf(currentMonthOrders - lastMonthOrders)
                    .divide(BigDecimal.valueOf(lastMonthOrders), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        // Calculate customers growth
        Long currentMonthCustomers = getNewCustomersForPeriod(startOfMonth, endOfDay);
        Long lastMonthCustomers = getNewCustomersForPeriod(startOfLastMonth, endOfLastMonth);
        BigDecimal customersGrowth = BigDecimal.ZERO;
        if (lastMonthCustomers > 0) {
            customersGrowth = BigDecimal.valueOf(currentMonthCustomers - lastMonthCustomers)
                    .divide(BigDecimal.valueOf(lastMonthCustomers), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        // Calculate products growth (assuming products added this month vs last month)
        // For simplicity, we'll set it to 0 for now as we don't track product creation date
        BigDecimal productsGrowth = BigDecimal.ZERO;

        return DashboardSummary.builder()
                .totalRevenue(getTotalRevenue())
                .todayRevenue(getRevenueForPeriod(startOfDay, endOfDay))
                .monthRevenue(currentMonthRevenue)
                .revenueGrowth(revenueGrowth)
                .totalOrders(orderRepository.count())
                .todayOrders(getOrderCountForPeriod(startOfDay, endOfDay))
                .pendingOrders(orderRepository.countByStatus("PENDING"))
                .ordersGrowth(ordersGrowth)
                .totalCustomers(getTotalCustomers())
                .newCustomersToday(getNewCustomersForPeriod(startOfDay, endOfDay))
                .customersGrowth(customersGrowth)
                .totalProducts(productRepository.count())
                .lowStockProducts(getLowStockProductCount())
                .productsGrowth(productsGrowth)
                .totalReturns(returnRepository.count())
                .pendingReturns(returnRepository.countByStatus(ReturnStatus.PENDING))
                .ordersByStatus(getOrdersByStatus())
                .build();
    }

    /**
     * Get revenue data for date range
     */
    public RevenueData getRevenueByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal revenue = getRevenueForPeriod(startDate, endDate);
        Long orderCount = getOrderCountForPeriod(startDate, endDate);
        
        return RevenueData.builder()
                .revenue(revenue)
                .orderCount(orderCount)
                .build();
    }

    /**
     * Get order statistics for date range
     */
    public OrderStats getOrderStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Long> statusCounts = getOrdersByStatus();
        Long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = getTotalRevenue();
        BigDecimal avgOrderValue = totalOrders > 0 
                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Get recent orders (last 10)
        List<AnalyticsResponse.RecentOrderData> recentOrdersList = getRecentOrders(10);

        return OrderStats.builder()
                .totalOrders(totalOrders)
                .completedOrders(statusCounts.getOrDefault("DELIVERED", 0L))
                .pendingOrders(statusCounts.getOrDefault("PENDING", 0L))
                .cancelledOrders(statusCounts.getOrDefault("CANCELLED", 0L))
                .shippedOrders(statusCounts.getOrDefault("SHIPPED", 0L))
                .averageOrderValue(avgOrderValue)
                .totalRevenue(totalRevenue)
                .ordersByStatus(statusCounts)
                .recentOrders(recentOrdersList)
                .build();
    }

    /**
     * Get product statistics for date range
     */
    public ProductStats getProductStatistics(LocalDateTime startDate, LocalDateTime endDate, int topCount) {
        List<TopProduct> topProducts = getTopSellingProducts(startDate, endDate, topCount);
        
        return ProductStats.builder()
                .totalProducts(productRepository.count())
                .lowStockProducts(getLowStockProductCount())
                .outOfStockProducts(productVariantRepository.countByStockQuantity(0))
                .topSellingProducts(topProducts)
                .salesByCategory(getSalesByCategory())
                .build();
    }

    /**
     * Get user statistics for date range
     */
    public UserStats getUserStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        Long newUsers = getNewCustomersForPeriod(startDate, endDate);
        Long totalUsers = userRepository.count();
        Long activeCustomers = getTotalCustomers();
        
        return UserStats.builder()
                .totalUsers(totalUsers)
                .newUsers(newUsers)
                .activeCustomers(activeCustomers)
                .build();
    }

    /**
     * Get top selling products for date range
     */
    public List<TopProduct> getTopSellingProducts(LocalDateTime startDate, LocalDateTime endDate, int limit) {
        List<Object[]> topProducts = orderItemRepository.getTopSellingProducts(limit);
        
        return topProducts.stream()
                .map(row -> TopProduct.builder()
                        .productId(((Number) row[0]).intValue())
                        .productName((String) row[1])
                        .quantitySold(((Number) row[2]).longValue())
                        .totalRevenue((BigDecimal) row[3])
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Get daily revenue for date range (for charts)
     */
    public List<DailyRevenue> getDailyRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Getting daily revenue from {} to {}", startDate, endDate);
        List<Object[]> dailyData = orderRepository.getRevenueByDay(startDate, endDate);
        log.info("Query returned {} rows", dailyData.size());
        
        List<DailyRevenue> result = dailyData.stream()
                .map(row -> {
                    DailyRevenue revenue = DailyRevenue.builder()
                            .date(((java.sql.Date) row[0]).toLocalDate())
                            .revenue((BigDecimal) row[1])
                            .orderCount(((Number) row[2]).longValue())
                            .build();
                    log.info("Daily revenue: date={}, revenue={}, orders={}", 
                            revenue.getDate(), revenue.getRevenue(), revenue.getOrderCount());
                    return revenue;
                })
                .collect(Collectors.toList());
        
        return result;
    }
}
