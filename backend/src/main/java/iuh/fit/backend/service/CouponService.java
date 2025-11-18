package iuh.fit.backend.service;

import iuh.fit.backend.dto.CouponResponse;
import iuh.fit.backend.dto.CreateCouponRequest;
import iuh.fit.backend.dto.UpdateCouponRequest;
import iuh.fit.backend.model.Coupon;
import iuh.fit.backend.repository.CouponRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

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