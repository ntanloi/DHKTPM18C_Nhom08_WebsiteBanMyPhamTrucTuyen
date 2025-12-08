package iuh.fit.backend.security;

import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import iuh.fit.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * WebSocket Handshake Interceptor for JWT Authentication
 * Extracts and validates JWT token from query params or headers before WebSocket connection
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {

        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();
            
            // Try to extract token from query parameter first (for WebSocket clients)
            String token = httpRequest.getParameter("token");
            
            // Fallback to Authorization header
            if (token == null || token.isEmpty()) {
                String authHeader = httpRequest.getHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                }
            }

            // Validate token
            if (token != null && !token.isEmpty()) {
                try {
                    String username = jwtUtil.extractUsername(token);
                    
                    if (username != null && jwtUtil.validateAccessToken(token, username)) {
                        // Store user info in WebSocket session attributes
                        attributes.put("username", username);
                        attributes.put("token", token);

                        return true;
                    }
                } catch (Exception e) {
                    return false;
                }
            }

            // For guest chat, allow connection but mark as guest
            String sessionId = httpRequest.getParameter("sessionId");
            if (sessionId != null && !sessionId.isEmpty()) {
                attributes.put("guestSessionId", sessionId);
                attributes.put("isGuest", true);
                return true;
            }

            return false;
        }

        return false;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
        
        if (exception != null) {
            log.error("WebSocket handshake failed", exception);
        }
    }
}
