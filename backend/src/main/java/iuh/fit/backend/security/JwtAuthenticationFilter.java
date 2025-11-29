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
     * Skip filter chỉ cho auth endpoints để tránh unnecessary processing
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return matcher.match("/api/auth/**", path)
                || matcher.match("/swagger-ui/**", path)
                || matcher.match("/v3/api-docs/**", path);
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