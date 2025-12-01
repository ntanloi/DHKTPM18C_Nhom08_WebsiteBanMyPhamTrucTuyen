package iuh.fit.backend.repository;

import iuh.fit.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrderId(Integer orderId);
    void deleteByOrderId(Integer orderId);
    
    // Analytics queries
    @Query(value = "SELECT p.id, p.name, SUM(oi.quantity) as qty, SUM(oi.quantity * oi.price) as revenue " +
            "FROM order_items oi " +
            "JOIN product_variants pv ON oi.product_variant_id = pv.id " +
            "JOIN products p ON pv.product_id = p.id " +
            "GROUP BY p.id, p.name ORDER BY qty DESC LIMIT ?1", 
            nativeQuery = true)
    List<Object[]> getTopSellingProducts(int limit);
    
    @Query(value = "SELECT c.id, c.name, SUM(oi.quantity * oi.price) as revenue " +
            "FROM order_items oi " +
            "JOIN product_variants pv ON oi.product_variant_id = pv.id " +
            "JOIN products p ON pv.product_id = p.id " +
            "JOIN categories c ON p.category_id = c.id " +
            "GROUP BY c.id, c.name ORDER BY revenue DESC", 
            nativeQuery = true)
    List<Object[]> getSalesByCategory();
}
