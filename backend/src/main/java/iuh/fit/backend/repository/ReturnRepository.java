package iuh.fit.backend.repository;

import iuh.fit.backend.model.Return;
import iuh.fit.backend.model.enums.ReturnStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Return entity operations
 */
@Repository
public interface ReturnRepository extends JpaRepository<Return, Integer> {

    /**
     * Find return by order ID
     */
    Optional<Return> findByOrderId(Integer orderId);

    /**
     * Find all returns by status
     */
    List<Return> findByStatus(ReturnStatus status);

    /**
     * Find all returns by status list
     */
    List<Return> findByStatusIn(List<ReturnStatus> statuses);

    /**
     * Find returns by customer (through order)
     */
    @Query("SELECT r FROM Return r JOIN r.order o WHERE o.userId = :userId ORDER BY r.createdAt DESC")
    List<Return> findByCustomerId(@Param("userId") Integer userId);

    /**
     * Find returns by processor
     */
    List<Return> findByProcessedBy(Integer processedBy);

    /**
     * Find pending returns
     */
    @Query("SELECT r FROM Return r WHERE r.status = 'PENDING' ORDER BY r.createdAt ASC")
    List<Return> findPendingReturns();

    /**
     * Find returns created within date range
     */
    List<Return> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Count returns by status
     */
    Long countByStatus(ReturnStatus status);

    /**
     * Check if order already has a return request
     */
    boolean existsByOrderId(Integer orderId);
}
