package iuh.fit.backend.service;

import iuh.fit.backend.dto.*;
import iuh.fit.backend.model.*;
import iuh.fit.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
    private final NotificationService notificationService;

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
            // FIX: BigDecimal.add() returns a new object, must reassign
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(itemRequest.getQuantity())));

            orderItems.add(orderItem);

            variant.setStockQuantity(variant.getStockQuantity() - itemRequest.getQuantity());
            productVariantRepository.save(variant);
        }

        order.setSubtotal(subtotal);
        
        BigDecimal discountAmount = BigDecimal.ZERO;
        order.setDiscountAmount(discountAmount);

        BigDecimal shippingFee = BigDecimal.valueOf(30000.0);
        order.setShippingFee(shippingFee);

        order.setTotalAmount(subtotal.subtract(discountAmount).add(shippingFee));

        order.setEstimateDeliveryFrom(LocalDate.now().plusDays(3));
        order.setEstimateDeliveryTo(LocalDate.now().plusDays(7));

        Order savedOrder = orderRepository.save(order);

        for (OrderItem item : orderItems) {
            item.setOrderId(savedOrder.getId());
            orderItemRepository.save(item);
        }

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

        // Send real-time notification for new order
        try {
            notificationService.notifyOrderCreated(savedOrder.getId(), request.getUserId());
            log.info("Order created notification sent for order: {}", savedOrder.getId());
        } catch (Exception e) {
            log.warn("Failed to send order created notification: {}", e.getMessage());
        }

        return getOrderDetail(savedOrder.getId());
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

        if (!"PENDING".equals(order.getStatus()) && !"CONFIRMED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
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
}
