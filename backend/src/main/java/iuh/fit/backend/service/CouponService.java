package iuh.fit.backend.service;

import iuh.fit.backend.dto.CouponResponse;
import iuh.fit.backend.dto.CreateCouponRequest;
import iuh.fit.backend.dto.UpdateCouponRequest;
import iuh.fit.backend.model.Coupon;
import iuh.fit.backend.model.CouponUsage;
import iuh.fit.backend.repository.CouponRepository;
import iuh.fit.backend.repository.CouponUsageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;

    @Transactional
    public CouponResponse createCoupon(CreateCouponRequest request) {
        if (couponRepository.findByCode(request.getCode()).isPresent()) {
            throw new RuntimeException("Coupon code already exists");
        }

        Coupon coupon = new Coupon();
        coupon.setCode(request.getCode());
        coupon.setDescription(request.getDescription());
        coupon.setIsActive(true);
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinOrderValue(request.getMinOrderValue());
        coupon.setMaxUsageValue(request.getMaxUsageValue());
        coupon.setValidFrom(request.getValidFrom());
        coupon.setValidTo(request.getValidTo());
        coupon.setCreatedByUserId(request.getCreatedByUserId());
        coupon.setCreatedAt(LocalDateTime.now());
        coupon.setUpdatedAt(LocalDateTime.now());

        Coupon savedCoupon = couponRepository.save(coupon);
        return convertToCouponResponse(savedCoupon);
    }

    public CouponResponse getCouponById(Integer couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        return convertToCouponResponse(coupon);
    }

    public CouponResponse getCouponByCode(String code) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        if (!Boolean.TRUE.equals(coupon.getIsActive())) {
            throw new RuntimeException("Coupon is not active");
        }

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom())) {
            throw new RuntimeException("Coupon is not yet valid");
        }
        if (coupon.getValidTo() != null && now.isAfter(coupon.getValidTo())) {
            throw new RuntimeException("Coupon has expired");
        }

        return convertToCouponResponse(coupon);
    }

    public List<CouponResponse> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::convertToCouponResponse)
                .collect(Collectors.toList());
    }

    public List<CouponResponse> getActiveCoupons() {
        return couponRepository.findByIsActive(true).stream()
                .map(this::convertToCouponResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CouponResponse updateCoupon(Integer couponId, UpdateCouponRequest request) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        if (request.getDescription() != null) {
            coupon.setDescription(request.getDescription());
        }
        if (request.getIsActive() != null) {
            coupon.setIsActive(request.getIsActive());
        }
        if (request.getDiscountType() != null) {
            coupon.setDiscountType(request.getDiscountType());
        }
        if (request.getDiscountValue() != null) {
            coupon.setDiscountValue(request.getDiscountValue());
        }
        if (request.getMinOrderValue() != null) {
            coupon.setMinOrderValue(request.getMinOrderValue());
        }
        if (request.getMaxUsageValue() != null) {
            coupon.setMaxUsageValue(request.getMaxUsageValue());
        }
        if (request.getValidFrom() != null) {
            coupon.setValidFrom(request.getValidFrom());
        }
        if (request.getValidTo() != null) {
            coupon.setValidTo(request.getValidTo());
        }
        coupon.setUpdatedAt(LocalDateTime.now());

        Coupon updatedCoupon = couponRepository.save(coupon);
        return convertToCouponResponse(updatedCoupon);
    }

    @Transactional
    public void deactivateCoupon(Integer couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        coupon.setIsActive(false);
        coupon.setUpdatedAt(LocalDateTime.now());
        couponRepository.save(coupon);
    }

    @Transactional
    public void deleteCoupon(Integer couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        couponRepository.delete(coupon);
    }

    /**
     * Validate if coupon can be used by a specific user for a specific order amount
     */
    public void validateCouponForUser(String couponCode, Integer userId, BigDecimal orderAmount) {
        Coupon coupon = couponRepository.findByCode(couponCode)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        // Check if coupon is active
        if (!Boolean.TRUE.equals(coupon.getIsActive())) {
            throw new RuntimeException("Coupon is not active");
        }

        // Check validity period
        LocalDateTime now = LocalDateTime.now();
        if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom())) {
            throw new RuntimeException("Coupon is not yet valid");
        }
        if (coupon.getValidTo() != null && now.isAfter(coupon.getValidTo())) {
            throw new RuntimeException("Coupon has expired");
        }

        // Check minimum order value
        if (coupon.getMinOrderValue() != null && orderAmount.compareTo(coupon.getMinOrderValue()) < 0) {
            throw new RuntimeException("Order amount must be at least " + coupon.getMinOrderValue() + " to use this coupon");
        }

        // Check total usage limit
        if (coupon.getMaxUsageValue() != null) {
            Long totalUsage = couponUsageRepository.countByCouponId(coupon.getId());
            if (totalUsage >= coupon.getMaxUsageValue()) {
                throw new RuntimeException("Coupon usage limit has been reached");
            }
        }

        // Check per-user usage limit
        if (coupon.getMaxUsagePerUser() != null) {
            Long userUsage = couponUsageRepository.countByCouponIdAndUserId(coupon.getId(), userId);
            if (userUsage >= coupon.getMaxUsagePerUser()) {
                throw new RuntimeException("You have already used this coupon the maximum number of times");
            }
        }
    }

    /**
     * Calculate discount amount based on coupon type and order subtotal
     */
    public BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        BigDecimal discount;

        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            // Percentage discount
            discount = subtotal.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            // Fixed amount discount
            discount = coupon.getDiscountValue();
        }

        // Apply maximum discount cap if set
        if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
            discount = coupon.getMaxDiscountAmount();
        }

        // Discount cannot exceed subtotal
        if (discount.compareTo(subtotal) > 0) {
            discount = subtotal;
        }

        return discount;
    }

    /**
     * Record coupon usage after order is placed
     */
    @Transactional
    public void recordCouponUsage(Integer couponId, Integer userId, Integer orderId, BigDecimal discountApplied) {
        CouponUsage usage = new CouponUsage();
        usage.setCouponId(couponId);
        usage.setUserId(userId);
        usage.setOrderId(orderId);
        usage.setDiscountApplied(discountApplied);
        couponUsageRepository.save(usage);

        // Increment usage count on coupon
        Coupon coupon = couponRepository.findById(couponId).orElse(null);
        if (coupon != null) {
            coupon.setUsageCount((coupon.getUsageCount() != null ? coupon.getUsageCount() : 0) + 1);
            couponRepository.save(coupon);
        }

        log.info("Recorded coupon usage: coupon={}, user={}, order={}, discount={}", 
                couponId, userId, orderId, discountApplied);
    }

    /**
     * Get coupon by code (for order service)
     */
    public Coupon getCouponEntityByCode(String code) {
        return couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
    }

    /**
     * Get user's coupon usage history
     */
    public List<CouponUsage> getUserCouponUsage(Integer userId) {
        return couponUsageRepository.findByUserId(userId);
    }

    private CouponResponse convertToCouponResponse(Coupon coupon) {
        CouponResponse response = new CouponResponse();
        response.setId(coupon.getId());
        response.setCode(coupon.getCode());
        response.setDescription(coupon.getDescription());
        response.setIsActive(coupon.getIsActive());
        response.setDiscountType(coupon.getDiscountType());
        response.setDiscountValue(coupon.getDiscountValue());
        response.setMinOrderValue(coupon.getMinOrderValue());
        response.setMaxUsageValue(coupon.getMaxUsageValue());
        response.setValidFrom(coupon.getValidFrom());
        response.setValidTo(coupon.getValidTo());
        response.setCreatedByUserId(coupon.getCreatedByUserId());
        response.setCreatedAt(coupon.getCreatedAt());
        response.setUpdatedAt(coupon.getUpdatedAt());
        return response;
    }
}