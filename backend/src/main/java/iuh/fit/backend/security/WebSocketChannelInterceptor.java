package iuh.fit.backend.security;

import iuh.fit.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

/**
 * WebSocket Channel Interceptor for setting Principal from JWT token
 * This allows @MessageMapping methods to access authenticated user via Principal
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Try to get token from session attributes (set by handshake interceptor)
            String token = (String) accessor.getSessionAttributes().get("token");
            String username = (String) accessor.getSessionAttributes().get("username");
            
            if (token != null && username != null) {
                try {
                    // Validate token and set Principal
                    if (jwtUtil.validateAccessToken(token, username)) {
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                userDetails, 
                                null, 
                                userDetails.getAuthorities()
                            );
                        accessor.setUser(authentication);
                        log.debug("WebSocket Principal set for user: {}", username);
                    }
                } catch (Exception e) {
                    log.warn("Failed to set WebSocket Principal: {}", e.getMessage());
                }
            } else {
                // Check for guest session
                Boolean isGuest = (Boolean) accessor.getSessionAttributes().get("isGuest");
                String guestSessionId = (String) accessor.getSessionAttributes().get("guestSessionId");
                
                if (Boolean.TRUE.equals(isGuest) && guestSessionId != null) {
                    // Create a guest principal (no authentication but can be tracked)
                    accessor.getSessionAttributes().put("principal", "guest:" + guestSessionId);
                    log.debug("WebSocket guest session: {}", guestSessionId);
                }
            }
        }

        return message;
    }
}
