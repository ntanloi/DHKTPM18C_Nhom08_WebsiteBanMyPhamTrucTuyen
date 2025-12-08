package iuh.fit.backend.security;

import iuh.fit.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final AntPathMatcher matcher = new AntPathMatcher();

    public JwtAuthenticationFilter(JwtUtil jwtUtil, @Lazy UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Skip filter cho các public endpoints để tránh overhead
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        String method = request.getMethod();
        
        // Auth endpoints that are PUBLIC (do not require JWT)
        if (matcher.match("/api/auth/login", path)) return true;
        if (matcher.match("/api/auth/register", path)) return true;
        if (matcher.match("/api/auth/send-otp", path)) return true;
        if (matcher.match("/api/auth/verify-otp", path)) return true;
        if (matcher.match("/api/auth/refresh", path)) return true;
        
        // Swagger/OpenAPI
        if (matcher.match("/swagger-ui/**", path)) return true;
        if (matcher.match("/v3/api-docs/**", path)) return true;
        
        // Public read-only endpoints
        if ("GET".equals(method)) {
            if (matcher.match("/api/products/**", path)) return true;
            if (matcher.match("/api/categories/**", path)) return true;
            if (matcher.match("/api/brands/**", path)) return true;
            if (matcher.match("/api/product-variants/**", path)) return true;
            if (matcher.match("/api/product-images/**", path)) return true;
            if (matcher.match("/api/payment-methods/**", path)) return true;
        }
        
        // Guest chat endpoints
        if (matcher.match("/api/chat/guest/**", path)) return true;
        
        // Payment callbacks
        if (matcher.match("/api/payments/vnpay/callback", path)) return true;
        if (matcher.match("/api/payments/vnpay/ipn", path)) return true;
        
        // WebSocket
        if (matcher.match("/ws/**", path)) return true;
        
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Lấy Authorization header
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Nếu không có token hoặc không bắt đầu với "Bearer ",
        // tiếp tục filter chain và để Spring Security quyết định
        if(header == null || !header.startsWith("Bearer ")) {
            log.debug("No JWT token found in request headers");
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token
        String token = header.substring(7);
        String username;

        try {
            username = jwtUtil.extractUsername(token);
            log.debug("JWT token found for user: {}", username);
        } catch (Exception e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            // Token không hợp lệ, tiếp tục như anonymous user
            filterChain.doFilter(request, response);
            return;
        }

        // Nếu có username và chưa authenticated
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Validate token
                if(jwtUtil.validateAccessToken(token, userDetails.getUsername())) {
                    log.debug("Valid JWT token, setting authentication for user: {}", username);

                    // Tạo authentication token
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set vào SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    log.warn("Invalid JWT token for user: {}", username);
                }
            } catch (Exception e) {
                log.error("Error loading user details: {}", e.getMessage());
            }
        }

        // QUAN TRỌNG: Luôn tiếp tục filter chain
        filterChain.doFilter(request, response);
    }
}