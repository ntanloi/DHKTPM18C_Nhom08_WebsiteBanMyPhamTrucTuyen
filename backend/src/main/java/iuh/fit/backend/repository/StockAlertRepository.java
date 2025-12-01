package iuh.fit.backend.repository;

import iuh.fit.backend.model.StockAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for StockAlert entity
 */
@Repository
public interface StockAlertRepository extends JpaRepository<StockAlert, Integer> {

    /**
     * Find alert by variant ID
     */
    Optional<StockAlert> findByVariantId(Integer variantId);

    /**
     * Find all unacknowledged alerts
     */
    List<StockAlert> findByAcknowledgedFalseOrderByCreatedAtDesc();

    /**
     * Find alerts by type
     */
    List<StockAlert> findByAlertType(String alertType);

    /**
     * Find alerts by severity
     */
    List<StockAlert> findBySeverity(String severity);

    /**
     * Find alerts by type and not acknowledged
     */
    List<StockAlert> findByAlertTypeAndAcknowledgedFalse(String alertType);

    /**
     * Count unacknowledged alerts
     */
    Long countByAcknowledgedFalse();

    /**
     * Count alerts by type
     */
    Long countByAlertType(String alertType);

    /**
     * Count critical unacknowledged alerts
     */
    Long countBySeverityAndAcknowledgedFalse(String severity);

    /**
     * Delete alert by variant ID
     */
    void deleteByVariantId(Integer variantId);

    /**
     * Check if alert exists for variant
     */
    boolean existsByVariantId(Integer variantId);

    /**
     * Acknowledge multiple alerts
     */
    @Modifying
    @Query("UPDATE StockAlert sa SET sa.acknowledged = true, sa.acknowledgedBy = :userId, " +
           "sa.acknowledgedAt = CURRENT_TIMESTAMP WHERE sa.id IN :alertIds")
    int acknowledgeAlerts(@Param("alertIds") List<Integer> alertIds, @Param("userId") Integer userId);

    /**
     * Find all active alerts with variant info
     */
    @Query("SELECT sa FROM StockAlert sa JOIN FETCH sa.variant WHERE sa.acknowledged = false ORDER BY sa.severity DESC, sa.createdAt DESC")
    List<StockAlert> findActiveAlertsWithVariant();
}
