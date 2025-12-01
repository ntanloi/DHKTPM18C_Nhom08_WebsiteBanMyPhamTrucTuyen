package iuh.fit.backend.service;

import iuh.fit.backend.dto.NotificationMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Send notification to a specific user
     */
    public void sendToUser(String userId, NotificationMessage notification) {
        log.info("Sending notification to user {}: {}", userId, notification.getType());
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications",
                notification
        );
    }

    /**
     * Send notification to all admins/managers
     */
    public void sendToAdmins(NotificationMessage notification) {
        log.info("Broadcasting notification to admins: {}", notification.getType());
        messagingTemplate.convertAndSend("/topic/admin/notifications", notification);
    }

    /**
     * Broadcast notification to all users (public topic)
     */
    public void broadcast(NotificationMessage notification) {
        log.info("Broadcasting notification: {}", notification.getType());
        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }

    /**
     * Send order status update to specific user and admins
     */
    public void notifyOrderStatusChange(Integer orderId, String newStatus, Integer userId) {
        NotificationMessage notification = NotificationMessage.orderStatusChanged(orderId, newStatus, userId);
        
        // Send to customer
        if (userId != null) {
            sendToUser(userId.toString(), notification);
        }
        
        // Also notify admins
        sendToAdmins(notification);
    }

    /**
     * Send order created notification
     */
    public void notifyOrderCreated(Integer orderId, Integer userId) {
        NotificationMessage notification = NotificationMessage.orderCreated(orderId, userId);
        
        // Send to customer
        if (userId != null) {
            sendToUser(userId.toString(), notification);
        }
        
        // Notify admins about new order
        sendToAdmins(notification);
    }

    /**
     * Send order cancelled notification
     */
    public void notifyOrderCancelled(Integer orderId, Integer userId) {
        NotificationMessage notification = NotificationMessage.orderCancelled(orderId, userId);
        
        if (userId != null) {
            sendToUser(userId.toString(), notification);
        }
        
        sendToAdmins(notification);
    }

    /**
     * Send payment completed notification
     */
    public void notifyPaymentCompleted(Integer orderId, Integer userId) {
        NotificationMessage notification = NotificationMessage.paymentCompleted(orderId, userId);
        
        if (userId != null) {
            sendToUser(userId.toString(), notification);
        }
        
        sendToAdmins(notification);
    }

    /**
     * Send low stock warning to admins
     */
    public void notifyLowStock(Integer productId, String productName, int quantity) {
        NotificationMessage notification = NotificationMessage.stockLow(productId, productName, quantity);
        sendToAdmins(notification);
    }
}
