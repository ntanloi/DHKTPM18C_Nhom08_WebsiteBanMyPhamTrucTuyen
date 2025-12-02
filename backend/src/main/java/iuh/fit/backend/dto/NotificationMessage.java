package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMessage {
    
    public enum NotificationType {
        ORDER_CREATED,
        ORDER_STATUS_CHANGED,
        ORDER_CANCELLED,
        PAYMENT_COMPLETED,
        PAYMENT_FAILED,
        STOCK_LOW,
        STOCK_OUT,
        NEW_REVIEW,
        RETURN_REQUESTED,
        RETURN_PROCESSED,
        REFUND_COMPLETED,
        SYSTEM
    }
    
    private String id;
    private String type; // Changed to String for flexibility
    private String title;
    private String message;
    private String targetUserId;
    private String referenceId;  // orderId, productId, etc.
    private String referenceType; // ORDER, PRODUCT, PAYMENT
    private Object data;
    private boolean read;
    private LocalDateTime createdAt;
    
    public static NotificationMessage orderStatusChanged(Integer orderId, String status, Integer userId) {
        return NotificationMessage.builder()
                .id(java.util.UUID.randomUUID().toString())
                .type(NotificationType.ORDER_STATUS_CHANGED.name())
                .title("Cập nhật đơn hàng")
                .message("Đơn hàng #" + orderId + " đã chuyển sang trạng thái: " + status)
                .targetUserId(userId != null ? userId.toString() : null)
                .referenceId(orderId.toString())
                .referenceType("ORDER")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
    }
    
    public static NotificationMessage orderCreated(Integer orderId, Integer userId) {
        return NotificationMessage.builder()
                .id(java.util.UUID.randomUUID().toString())
                .type(NotificationType.ORDER_CREATED.name())
                .title("Đặt hàng thành công")
                .message("Đơn hàng #" + orderId + " đã được tạo thành công")
                .targetUserId(userId != null ? userId.toString() : null)
                .referenceId(orderId.toString())
                .referenceType("ORDER")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
    }
    
    public static NotificationMessage orderCancelled(Integer orderId, Integer userId) {
        return NotificationMessage.builder()
                .id(java.util.UUID.randomUUID().toString())
                .type(NotificationType.ORDER_CANCELLED.name())
                .title("Đơn hàng đã hủy")
                .message("Đơn hàng #" + orderId + " đã bị hủy")
                .targetUserId(userId != null ? userId.toString() : null)
                .referenceId(orderId.toString())
                .referenceType("ORDER")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
    }
    
    public static NotificationMessage paymentCompleted(Integer orderId, Integer userId) {
        return NotificationMessage.builder()
                .id(java.util.UUID.randomUUID().toString())
                .type(NotificationType.PAYMENT_COMPLETED.name())
                .title("Thanh toán thành công")
                .message("Đơn hàng #" + orderId + " đã được thanh toán")
                .targetUserId(userId != null ? userId.toString() : null)
                .referenceId(orderId.toString())
                .referenceType("PAYMENT")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
    }
    
    public static NotificationMessage stockLow(Integer productId, String productName, int quantity) {
        return NotificationMessage.builder()
                .id(java.util.UUID.randomUUID().toString())
                .type(NotificationType.STOCK_LOW.name())
                .title("Cảnh báo tồn kho")
                .message("Sản phẩm " + productName + " chỉ còn " + quantity + " sản phẩm")
                .referenceId(productId.toString())
                .referenceType("PRODUCT")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
