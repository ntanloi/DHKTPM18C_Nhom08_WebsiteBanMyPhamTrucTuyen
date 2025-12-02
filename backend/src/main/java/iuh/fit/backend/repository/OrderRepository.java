package iuh.fit.backend.repository;

import iuh.fit.backend.model.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserId(Integer userId);
    List<Order> findByStatus(String status);
    List<Order> findByUserIdAndStatus(Integer userId, String status);
    
    // Analytics queries
    Long countByStatus(String status);
    
    Long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status IN :statuses")
    BigDecimal sumTotalAmountByStatusIn(@Param("statuses") List<String> statuses);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    BigDecimal sumTotalAmountByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(DISTINCT o.userId) FROM Order o")
    Long countDistinctUserId();
    
    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countGroupByStatus();
    
    @Query(value = "SELECT DATE(created_at) as date, SUM(total_amount) as revenue, COUNT(*) as order_count " +
            "FROM orders WHERE created_at BETWEEN :start AND :end GROUP BY DATE(created_at) ORDER BY date", 
            nativeQuery = true)
    List<Object[]> getRevenueByDay(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query(value = "SELECT DATE_FORMAT(created_at, '%Y-%m') as period, SUM(total_amount) as revenue, COUNT(*) as order_count " +
            "FROM orders WHERE created_at BETWEEN :start AND :end GROUP BY DATE_FORMAT(created_at, '%Y-%m') ORDER BY period", 
            nativeQuery = true)
    List<Object[]> getRevenueByMonth(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT o.userId, u.fullName, u.email, COUNT(o), SUM(o.totalAmount) " +
            "FROM Order o JOIN o.user u GROUP BY o.userId, u.fullName, u.email ORDER BY SUM(o.totalAmount) DESC")
    List<Object[]> getTopCustomers(int limit);
    
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findTopByOrderByCreatedAtDesc(Pageable pageable);
    
    default List<Order> findTopByOrderByCreatedAtDesc(int limit) {
        return findTopByOrderByCreatedAtDesc(Pageable.ofSize(limit));
    }
}
