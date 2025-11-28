package iuh.fit.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    private SecretKey secretKey;

    @PostConstruct
    public void initKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate signing key from secret
    private SecretKey getSignKey() {
        return secretKey;
    }

    // Generate JWT access token
    public String generateAccessToken(String email, Long userId, String role) {
        Map<String, Object> claims = Map.of("userId", userId,
            "role", role,
            "type", "ACCESS"
        );
        return createToken(claims, email, expiration);
    }

    // Generate JWT refresh token
    public String generateRefreshToken(String email) {
        return createToken(Map.of("type", "REFRESH"), email, refreshExpiration);
    }

    public boolean isRefreshToken(String token) {
        return "REFRESH".equals(extractClaim(token, c -> c.get("type", String.class)));
    }

    // Create JWT token with claims and expiration
    private String createToken(Map<String, Object> claims, String subject, Long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSignKey())
                .compact();
    }

    // Extract email from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract userId from token claims
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    // Extract role from token claims
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    // Extract expiration date from token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract specific claim using claims resolver
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Parse and extract all claims from token
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Check if token expired
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Validate access token with email matching
    public Boolean validateAccessToken(String token, String email) {
        try {
            return isAccessToken(token) && !isTokenExpired(token) && email.equals(extractUsername(token));
        } catch(Exception e) {
            return false;
        }
    }

    public Boolean validateRefreshToken(String token, String email) {
        try {
            return isRefreshToken(token) && !isTokenExpired(token) && email.equals(extractUsername(token));
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean isAccessToken(String token) {
        return "ACCESS".equals(extractClaim(token, c -> c.get("type", String.class)));
    }
}
