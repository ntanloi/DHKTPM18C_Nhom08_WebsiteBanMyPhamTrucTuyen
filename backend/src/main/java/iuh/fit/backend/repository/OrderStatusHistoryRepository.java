package iuh.fit.backend.repository;

import iuh.fit.backend.model.OrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Integer> {
    List<OrderStatusHistory> findByOrderId(Integer orderId);
    Optional<OrderStatusHistory> findByOrderIdAndStatus(Integer orderId, String status);
}
