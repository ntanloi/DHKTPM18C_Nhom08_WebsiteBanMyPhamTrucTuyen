package iuh.fit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Redis Cache Service
 * Use cases:
 * - OTP codes with TTL
 * - JWT refresh tokens
 * - Product catalog caching
 * - Shopping cart temporary storage
 * - Rate limiting counters
 */
@Service
@RequiredArgsConstructor
public class RedisCacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    // Basic operations
    public void set(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    public void set(String key, Object value, long timeout, TimeUnit unit) {
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public boolean exists(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    public boolean delete(String key) {
        return Boolean.TRUE.equals(redisTemplate.delete(key));
    }

    public boolean expire(String key, long timeout, TimeUnit unit) {
        return Boolean.TRUE.equals(redisTemplate.expire(key, timeout, unit));
    }

    // OTP-specific operations
    public void saveOtp(String email, String code, long expirationMs) {
        String key = "otp:" + email;
        set(key, code, expirationMs, TimeUnit.MILLISECONDS);
    }

    public String getOtp(String email) {
        String key = "otp:" + email;
        Object value = get(key);
        return value != null ? value.toString() : null;
    }

    public boolean verifyOtp(String email, String code) {
        String storedCode = getOtp(email);
        if (storedCode != null && storedCode.equals(code)) {
            delete("otp:" + email);
            return true;
        }
        return false;
    }

    // Refresh token operations
    public void saveRefreshToken(String userId, String token, long expirationMs) {
        String key = "refresh_token:" + userId;
        set(key, token, expirationMs, TimeUnit.MILLISECONDS);
    }

    public String getRefreshToken(String userId) {
        String key = "refresh_token:" + userId;
        Object value = get(key);
        return value != null ? value.toString() : null;
    }

    public void revokeRefreshToken(String userId) {
        delete("refresh_token:" + userId);
    }

    // Product cache operations
    public void cacheProduct(String productId, Object productData, long ttlMinutes) {
        String key = "product:" + productId;
        set(key, productData, ttlMinutes, TimeUnit.MINUTES);
    }

    public Object getCachedProduct(String productId) {
        return get("product:" + productId);
    }

    public void invalidateProductCache(String productId) {
        delete("product:" + productId);
    }

    // Rate limiting
    public boolean checkRateLimit(String identifier, int maxRequests, long windowSeconds) {
        String key = "rate_limit:" + identifier;
        Long count = redisTemplate.opsForValue().increment(key);
        
        if (count == null) {
            return false;
        }
        
        if (count == 1) {
            expire(key, windowSeconds, TimeUnit.SECONDS);
        }
        
        return count <= maxRequests;
    }

    // Shopping cart cache
    public void cacheCart(Integer userId, Object cartData) {
        String key = "cart:" + userId;
        set(key, cartData, 24, TimeUnit.HOURS); // Cache for 24 hours
    }

    public Object getCachedCart(Integer userId) {
        return get("cart:" + userId);
    }

    public void invalidateCart(Integer userId) {
        delete("cart:" + userId);
    }
}
