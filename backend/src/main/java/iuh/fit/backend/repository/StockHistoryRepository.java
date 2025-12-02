package iuh.fit.backend.repository;

import iuh.fit.backend.model.StockHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for StockHistory entity
 */
@Repository
public interface StockHistoryRepository extends JpaRepository<StockHistory, Integer> {

    /**
     * Find history by variant ID
     */
    List<StockHistory> findByVariantIdOrderByCreatedAtDesc(Integer variantId);

    /**
     * Find history by variant ID with pagination
     */
    Page<StockHistory> findByVariantId(Integer variantId, Pageable pageable);

    /**
     * Find history by reference type and ID
     */
    List<StockHistory> findByReferenceTypeAndReferenceId(String referenceType, Integer referenceId);

    /**
     * Find history by date range
     */
    List<StockHistory> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);

    /**
     * Find history by performer
     */
    List<StockHistory> findByPerformedByOrderByCreatedAtDesc(Integer performedBy);

    /**
     * Find recent history with limit
     */
    @Query("SELECT sh FROM StockHistory sh ORDER BY sh.createdAt DESC")
    List<StockHistory> findRecentHistory(Pageable pageable);

    /**
     * Count adjustments by type within date range
     */
    @Query("SELECT sh.adjustmentType, COUNT(sh), SUM(ABS(sh.quantityChange)) " +
           "FROM StockHistory sh WHERE sh.createdAt BETWEEN :start AND :end " +
           "GROUP BY sh.adjustmentType")
    List<Object[]> countByAdjustmentTypeInRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
