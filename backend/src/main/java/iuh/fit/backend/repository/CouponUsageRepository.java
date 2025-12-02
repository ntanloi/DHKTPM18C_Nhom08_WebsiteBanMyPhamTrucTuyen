package iuh.fit.backend.repository;

import iuh.fit.backend.model.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for CouponUsage entity operations
 */
@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Integer> {

    /**
     * Find all usage records for a specific coupon
     */
    List<CouponUsage> findByCouponId(Integer couponId);

    /**
     * Find all coupon usage by user
     */
    List<CouponUsage> findByUserId(Integer userId);

    /**
     * Find usage for a specific coupon by a specific user
     */
    List<CouponUsage> findByCouponIdAndUserId(Integer couponId, Integer userId);

    /**
     * Count how many times a user has used a specific coupon
     */
    Long countByCouponIdAndUserId(Integer couponId, Integer userId);

    /**
     * Count total usage of a coupon
     */
    Long countByCouponId(Integer couponId);

    /**
     * Check if coupon was used for a specific order
     */
    boolean existsByOrderId(Integer orderId);

    /**
     * Check if user has already used this coupon
     */
    @Query("SELECT CASE WHEN COUNT(cu) > 0 THEN true ELSE false END FROM CouponUsage cu WHERE cu.couponId = :couponId AND cu.userId = :userId")
    boolean hasUserUsedCoupon(@Param("couponId") Integer couponId, @Param("userId") Integer userId);
}
