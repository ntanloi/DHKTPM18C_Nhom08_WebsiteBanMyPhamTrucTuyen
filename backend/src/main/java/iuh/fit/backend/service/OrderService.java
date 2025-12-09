package iuh.fit.backend.service;

import iuh.fit.backend.dto.*;
import iuh.fit.backend.model.*;
import iuh.fit.backend.repository.*;
import iuh.fit.backend.security.CustomUserDetails;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final RecipientInformationRepository recipientInformationRepository;
    private final PaymentRepository paymentRepository;
    private final ShipmentRepository shipmentRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final NotificationService notificationService;
    private final CouponService couponService;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    
    private static final Integer GUEST_USER_ID = 0;

    @Transactional
    public OrderDetailResponse createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setStatus("PENDING");
        order.setNotes(request.getNotes());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemRequest : request.getOrderItems()) {
            // Use pessimistic lock to prevent race conditions on stock
            ProductVariant variant = productVariantRepository.findByIdForUpdate(itemRequest.getProductVariantId())
                    .orElseThrow(() -> new RuntimeException("Product variant not found"));

            if (variant.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + variant.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProductVariantId(itemRequest.getProductVariantId());
            orderItem.setQuantity(itemRequest.getQuantity());

            BigDecimal price = variant.getSalePrice() != null ? variant.getSalePrice() : variant.getPrice();
            orderItem.setPrice(price); // Set price for order item
            
            // FIX: BigDecimal.add() returns a new object, must reassign
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(itemRequest.getQuantity())));

            orderItems.add(orderItem);

            variant.setStockQuantity(variant.getStockQuantity() - itemRequest.getQuantity());
            productVariantRepository.save(variant);
        }

        order.setSubtotal(subtotal);
        
        // Apply coupon if provided
        BigDecimal discountAmount = BigDecimal.ZERO;
        Coupon appliedCoupon = null;
        
        if (request.getCouponId() != null) {
            appliedCoupon = couponRepository.findById(request.getCouponId())
                    .orElseThrow(() -> new RuntimeException("Coupon not found"));
            
            // Validate coupon for this user and order amount (skip user validation for guest)
            if (request.getUserId() != null) {
                couponService.validateCouponForUser(appliedCoupon.getCode(), request.getUserId(), subtotal);
            }
            
            // Calculate discount
            discountAmount = couponService.calculateDiscount(appliedCoupon, subtotal);
            
            // Set coupon info on order
            order.setCouponId(appliedCoupon.getId());
            order.setCouponCode(appliedCoupon.getCode());
            
            log.info("Applied coupon {} with discount {} to order", appliedCoupon.getCode(), discountAmount);
        }
        
        order.setDiscountAmount(discountAmount);

        BigDecimal shippingFee = BigDecimal.valueOf(30000.0);
        order.setShippingFee(shippingFee);

        order.setTotalAmount(subtotal.subtract(discountAmount).add(shippingFee));

        order.setEstimateDeliveryFrom(LocalDate.now().plusDays(3));
        order.setEstimateDeliveryTo(LocalDate.now().plusDays(7));

        Order savedOrder = orderRepository.save(order);
        
        // Record coupon usage after order is saved (only for logged in users)
        if (appliedCoupon != null && request.getUserId() != null) {
            couponService.recordCouponUsage(appliedCoupon.getId(), request.getUserId(), savedOrder.getId(), discountAmount);
        }

        // Set order ID for all items and save in batch
        orderItems.forEach(item -> item.setOrderId(savedOrder.getId()));
        orderItemRepository.saveAll(orderItems);

        if (request.getRecipientInfo() != null) {
            RecipientInformation recipientInfo = new RecipientInformation();
            recipientInfo.setOrderId(savedOrder.getId());  // FIX: Link recipient to order
            recipientInfo.setRecipientFirstName(request.getRecipientInfo().getRecipientFirstName());
            recipientInfo.setRecipientLastName(request.getRecipientInfo().getRecipientLastName());
            recipientInfo.setRecipientPhone(request.getRecipientInfo().getRecipientPhone());
            recipientInfo.setRecipientEmail(request.getRecipientInfo().getRecipientEmail());
            recipientInfo.setShippingRecipientAddress(request.getRecipientInfo().getShippingRecipientAddress());
            recipientInfo.setIsAnotherReceiver(request.getRecipientInfo().getIsAnotherReceiver());
            recipientInfo.setCreatedAt(LocalDateTime.now());
            recipientInformationRepository.save(recipientInfo);
        }

        OrderStatusHistory statusHistory = new OrderStatusHistory();
        statusHistory.setOrderId(savedOrder.getId());
        statusHistory.setStatus("PENDING");
        statusHistory.setCreatedAt(LocalDateTime.now());
        statusHistory.setUpdatedAt(LocalDateTime.now());
        orderStatusHistoryRepository.save(statusHistory);

        if (request.getPaymentMethodId() != null) {
            Payment payment = new Payment();
            payment.setOrderId(savedOrder.getId());
            payment.setPaymentMethodId(request.getPaymentMethodId());
            payment.setAmount(savedOrder.getTotalAmount());
            
            // Check if this is from VNPay callback (payment already completed)
            // For VNPay, payment is completed before order creation in new flow
            // We can detect this by checking if payment method is VNPay (id = 6 typically)
            // For now, default to PENDING, frontend will update if needed
            payment.setStatus("PENDING");
            payment.setCreatedAt(LocalDateTime.now());
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
        }

        Shipment shipment = new Shipment();
        shipment.setOrderId(savedOrder.getId());
        shipment.setStatus("PENDING");
        shipment.setCreatedAt(LocalDateTime.now());
        shipment.setUpdatedAt(LocalDateTime.now());
        shipmentRepository.save(shipment);

        // Send real-time notification for new order (only if user is logged in)
        if (request.getUserId() != null) {
            try {
                notificationService.notifyOrderCreated(savedOrder.getId(), request.getUserId());
                log.info("Order created notification sent for order: {}", savedOrder.getId());
            } catch (Exception e) {
                log.warn("Failed to send order created notification: {}", e.getMessage());
            }
        }

        return getOrderDetail(savedOrder.getId());
    }

    /**
     * Get order detail with authentication check
     * Allows user to view their own orders or admin/manager to view any order
     */
    public OrderDetailResponse getOrderDetailWithAuth(Integer orderId, Authentication authentication) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Check if user has permission to view this order
        String username = authentication.getName();
        boolean isAdminOrManager = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MANAGER"));
        
        // If not admin/manager, check if order belongs to user
        if (!isAdminOrManager) {
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (!order.getUserId().equals(user.getId())) {
                throw new RuntimeException("Access denied: You can only view your own orders");
            }
        }
        
        return getOrderDetail(orderId);
    }

    public OrderDetailResponse getGuestOrderDetail(Integer orderId, String email) {
        // Verify the email matches the recipient email
        RecipientInformation recipientInfo = recipientInformationRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Recipient information not found"));
        
        if (!recipientInfo.getRecipientEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Access denied: Email does not match order recipient");
        }
        
        return getOrderDetail(orderId);
    }

    public OrderDetailResponse getOrderDetail(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderDetailResponse response = new OrderDetailResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
        response.setStatus(order.getStatus());
        response.setSubtotal(order.getSubtotal());
        response.setTotalAmount(order.getTotalAmount());
        response.setDiscountAmount(order.getDiscountAmount());
        response.setShippingFee(order.getShippingFee());
        response.setNotes(order.getNotes());
        response.setEstimateDeliveryFrom(order.getEstimateDeliveryFrom());
        response.setEstimateDeliveryTo(order.getEstimateDeliveryTo());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
        List<OrderItemResponse> itemResponses = orderItems.stream().map(item -> {
            OrderItemResponse itemResponse = new OrderItemResponse();
            itemResponse.setId(item.getId());
            itemResponse.setProductVariantId(item.getProductVariantId());
            itemResponse.setQuantity(item.getQuantity());

            ProductVariant variant = productVariantRepository.findById(item.getProductVariantId()).orElse(null);
            if (variant != null) {
                itemResponse.setVariantName(variant.getName());
                if (variant.getProduct() != null) {
                    itemResponse.setProductName(variant.getProduct().getName());
                    
                    // Get first product image
                    List<ProductImage> images = productImageRepository.findByProductId(variant.getProduct().getId());
                    if (!images.isEmpty()) {
                        itemResponse.setImageUrl(images.get(0).getImageUrl());
                    }
                }
                BigDecimal price = variant.getSalePrice() != null ? variant.getSalePrice() : variant.getPrice();
                itemResponse.setPrice(price);
                itemResponse.setSubtotal(price.multiply(BigDecimal.valueOf(item.getQuantity())));
            }

            return itemResponse;
        }).collect(Collectors.toList());
        response.setOrderItems(itemResponses);

        recipientInformationRepository.findByOrderId(orderId).ifPresent(recipient -> {
            RecipientInfoResponse recipientResponse = new RecipientInfoResponse();
            recipientResponse.setRecipientFirstName(recipient.getRecipientFirstName());
            recipientResponse.setRecipientLastName(recipient.getRecipientLastName());
            recipientResponse.setRecipientPhone(recipient.getRecipientPhone());
            recipientResponse.setRecipientEmail(recipient.getRecipientEmail());
            recipientResponse.setShippingRecipientAddress(recipient.getShippingRecipientAddress());
            recipientResponse.setIsAnotherReceiver(recipient.getIsAnotherReceiver());
            response.setRecipientInfo(recipientResponse);
        });

        paymentRepository.findByOrderId(orderId).ifPresent(payment -> {
            PaymentInfoResponse paymentResponse = new PaymentInfoResponse();
            paymentResponse.setId(payment.getId());
            paymentResponse.setAmount(payment.getAmount());
            paymentResponse.setStatus(payment.getStatus());
            paymentResponse.setTransactionCode(payment.getTransactionCode());
            paymentResponse.setCreatedAt(payment.getCreatedAt());
            response.setPaymentInfo(paymentResponse);
        });

        shipmentRepository.findByOrderId(orderId).ifPresent(shipment -> {
            ShipmentInfoResponse shipmentResponse = new ShipmentInfoResponse();
            shipmentResponse.setId(shipment.getId());
            shipmentResponse.setStatus(shipment.getStatus());
            shipmentResponse.setTrackingCode(shipment.getTrackingCode());
            shipmentResponse.setShippingProviderName(shipment.getShippingProviderName());
            shipmentResponse.setShippedAt(shipment.getShippedAt());
            shipmentResponse.setDeliveredAt(shipment.getDeliveredAt());
            response.setShipmentInfo(shipmentResponse);
        });

        return response;
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status).stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Integer orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        Order updatedOrder = orderRepository.save(order);

        OrderStatusHistory statusHistory = new OrderStatusHistory();
        statusHistory.setOrderId(orderId);
        statusHistory.setStatus(newStatus);
        statusHistory.setCreatedAt(LocalDateTime.now());
        statusHistory.setUpdatedAt(LocalDateTime.now());
        orderStatusHistoryRepository.save(statusHistory);

        if ("SHIPPED".equals(newStatus)) {
            shipmentRepository.findByOrderId(orderId).ifPresent(shipment -> {
                shipment.setStatus("SHIPPED");
                shipment.setShippedAt(LocalDateTime.now());
                shipment.setUpdatedAt(LocalDateTime.now());
                shipmentRepository.save(shipment);
            });
        } else if ("DELIVERED".equals(newStatus)) {
            shipmentRepository.findByOrderId(orderId).ifPresent(shipment -> {
                shipment.setStatus("DELIVERED");
                shipment.setDeliveredAt(LocalDateTime.now());
                shipment.setUpdatedAt(LocalDateTime.now());
                shipmentRepository.save(shipment);
            });
        }

        // Send real-time notification for order status change
        try {
            notificationService.notifyOrderStatusChange(orderId, newStatus, updatedOrder.getUserId());
            log.info("Order status change notification sent for order: {}, new status: {}", orderId, newStatus);
        } catch (Exception e) {
            log.warn("Failed to send order status change notification: {}", e.getMessage());
        }

        return convertToOrderResponse(updatedOrder);
    }

    @Transactional
    public OrderResponse cancelOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Cannot cancel order if it's SHIPPED, DELIVERED or already CANCELLED
        List<String> nonCancellableStatuses = List.of("SHIPPED", "DELIVERING", "DELIVERED", "CANCELLED");
        if (nonCancellableStatuses.contains(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus() + 
                                       ". Only PENDING and CONFIRMED orders can be cancelled.");
        }

        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
        for (OrderItem item : orderItems) {
            // Use pessimistic lock for stock restoration on cancel
            ProductVariant variant = productVariantRepository.findByIdForUpdate(item.getProductVariantId()).orElse(null);
            if (variant != null) {
                variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                productVariantRepository.save(variant);
            }
        }

        order.setStatus("CANCELLED");
        order.setUpdatedAt(LocalDateTime.now());
        Order cancelledOrder = orderRepository.save(order);

        OrderStatusHistory statusHistory = new OrderStatusHistory();
        statusHistory.setOrderId(orderId);
        statusHistory.setStatus("CANCELLED");
        statusHistory.setCreatedAt(LocalDateTime.now());
        statusHistory.setUpdatedAt(LocalDateTime.now());
        orderStatusHistoryRepository.save(statusHistory);

        paymentRepository.findByOrderId(orderId).ifPresent(payment -> {
            payment.setStatus("CANCELLED");
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
        });

        // Send real-time notification for order cancellation
        try {
            notificationService.notifyOrderCancelled(orderId, order.getUserId());
            log.info("Order cancellation notification sent for order: {}", orderId);
        } catch (Exception e) {
            log.warn("Failed to send order cancellation notification: {}", e.getMessage());
        }

        return convertToOrderResponse(cancelledOrder);
    }

    /**
     * Cancel order with authentication check - user can only cancel their own orders
     * Admin/Manager can cancel any order
     */
    @Transactional
    public OrderResponse cancelOrderWithAuth(Integer orderId, Authentication authentication) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Check ownership - user can only cancel their own orders
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN") || auth.getAuthority().equals("ROLE_MANAGER"));
        
        if (!isAdmin && !order.getUserId().equals(userDetails.getUserId())) {
            throw new RuntimeException("You can only cancel your own orders");
        }
        
        return cancelOrder(orderId);
    }

    @Transactional
    public void deleteOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        orderItemRepository.deleteByOrderId(orderId);
        orderStatusHistoryRepository.findByOrderId(orderId).forEach(orderStatusHistoryRepository::delete);
        recipientInformationRepository.findByOrderId(orderId).ifPresent(recipientInformationRepository::delete);
        paymentRepository.findByOrderId(orderId).ifPresent(paymentRepository::delete);
        shipmentRepository.findByOrderId(orderId).ifPresent(shipmentRepository::delete);

        orderRepository.delete(order);
    }

    private OrderResponse convertToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
        response.setStatus(order.getStatus());
        response.setSubtotal(order.getSubtotal());
        response.setTotalAmount(order.getTotalAmount());
        response.setDiscountAmount(order.getDiscountAmount());
        response.setShippingFee(order.getShippingFee());
        response.setNotes(order.getNotes());
        response.setEstimateDeliveryFrom(order.getEstimateDeliveryFrom());
        response.setEstimateDeliveryTo(order.getEstimateDeliveryTo());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        return response;
    }
    
    @Transactional
    public OrderDetailResponse createGuestOrder(CreateOrderRequest request) {
        try {
            // Validate recipient info
            if (request.getRecipientInfo() == null) {
                throw new RuntimeException("Recipient information is required for guest orders");
            }
            if (request.getRecipientInfo().getRecipientEmail() == null || 
                request.getRecipientInfo().getRecipientEmail().trim().isEmpty()) {
                throw new RuntimeException("Recipient email is required for guest orders");
            }
            
            // Create a new guest user for this order
            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("USER role not found"));
            
            // Use recipient info to create guest user
            String guestEmail = request.getRecipientInfo().getRecipientEmail();
            String guestFullName = request.getRecipientInfo().getRecipientFirstName() + " " + 
                                   request.getRecipientInfo().getRecipientLastName();
            String guestPhone = request.getRecipientInfo().getRecipientPhone();
            
            // Check if user with this email already exists
            User guestUser = userRepository.findByEmail(guestEmail).orElse(null);
            
            if (guestUser == null) {
                // Create new guest user
                guestUser = new User();
                guestUser.setEmail(guestEmail);
                guestUser.setPassword("$2a$10$guestUserNoPassword"); // Dummy password, guest can't login
                guestUser.setFullName(guestFullName);
                guestUser.setPhoneNumber(guestPhone);
                guestUser.setRole(userRole);
                guestUser.setIsActive(true);
                guestUser.setCreatedAt(LocalDateTime.now());
                guestUser.setUpdatedAt(LocalDateTime.now());
                guestUser = userRepository.save(guestUser);
                log.info("Created new guest user with email: {} and ID: {}", guestEmail, guestUser.getId());
            } else {
                log.info("Using existing user with email: {} and ID: {}", guestEmail, guestUser.getId());
            }
            
            // Set userId for the order
            request.setUserId(guestUser.getId());
            
            // Create order using existing logic
            return createOrder(request);
        } catch (Exception e) {
            log.error("Error creating guest order", e);
            throw e;
        }
    }
    
    /**
     * Update payment status to COMPLETED for an order
     * Used after successful VNPay payment
     */
    @Transactional
    public void markPaymentAsCompleted(Integer orderId) {
        paymentRepository.findByOrderId(orderId).ifPresent(payment -> {
            payment.setStatus("COMPLETED");
            payment.setPaidAt(LocalDateTime.now());
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
            log.info("Marked payment as COMPLETED for order: {}", orderId);
        });
    }
}
