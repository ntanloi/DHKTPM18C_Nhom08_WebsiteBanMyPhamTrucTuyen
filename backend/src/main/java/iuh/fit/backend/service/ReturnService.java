package iuh.fit.backend.service;

import iuh.fit.backend.dto.*;
import iuh.fit.backend.exception.ResourceNotFoundException;
import iuh.fit.backend.model.*;
import iuh.fit.backend.model.enums.ReturnStatus;
import iuh.fit.backend.model.enums.ReturnType;
import iuh.fit.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for handling return/refund operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReturnService {

    private final ReturnRepository returnRepository;
    private final ReturnItemRepository returnItemRepository;
    private final ReturnImageRepository returnImageRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /**
     * Create a new return request
     */
    @Transactional
    public ReturnResponse createReturnRequest(Integer customerId, CreateReturnRequest request) {
        // Validate order exists and belongs to customer
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUserId().equals(customerId)) {
            throw new RuntimeException("Order does not belong to this customer");
        }

        // Check if order is eligible for return (DELIVERED status)
        if (!"DELIVERED".equals(order.getStatus())) {
            throw new RuntimeException("Only delivered orders can be returned");
        }

        // Check if return already exists for this order
        if (returnRepository.existsByOrderId(request.getOrderId())) {
            throw new RuntimeException("Return request already exists for this order");
        }

        // Create return request
        Return returnRequest = new Return();
        returnRequest.setOrderId(request.getOrderId());
        returnRequest.setReason(request.getReason());
        returnRequest.setReturnType(request.getReturnType() != null ? request.getReturnType() : ReturnType.REFUND);
        returnRequest.setStatus(ReturnStatus.PENDING);
        
        // Set bank details if refund type
        if (ReturnType.REFUND.equals(request.getReturnType())) {
            returnRequest.setRefundMethod(request.getRefundMethod());
            returnRequest.setBankAccountNumber(request.getBankAccountNumber());
            returnRequest.setBankName(request.getBankName());
            returnRequest.setAccountHolderName(request.getAccountHolderName());
        }

        Return savedReturn = returnRepository.save(returnRequest);
        log.info("Created return request {} for order {}", savedReturn.getId(), request.getOrderId());

        // Create return items
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (CreateReturnRequest.ReturnItemRequest itemRequest : request.getItems()) {
                // Validate order item exists
                OrderItem orderItem = orderItemRepository.findById(itemRequest.getOrderItemId())
                        .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));

                if (!orderItem.getOrderId().equals(request.getOrderId())) {
                    throw new RuntimeException("Order item does not belong to this order");
                }

                ReturnItem returnItem = new ReturnItem();
                returnItem.setReturnId(savedReturn.getId());
                returnItem.setOrderItemId(itemRequest.getOrderItemId());
                returnItem.setQuantity(itemRequest.getQuantity() != null ? itemRequest.getQuantity() : orderItem.getQuantity());
                returnItem.setReason(itemRequest.getReason());
                returnItem.setConditionStatus(itemRequest.getConditionStatus());
                returnItemRepository.save(returnItem);
            }
        }

        // Create return images
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            for (String imageUrl : request.getImageUrls()) {
                ReturnImage returnImage = new ReturnImage();
                returnImage.setReturnId(savedReturn.getId());
                returnImage.setImageUrl(imageUrl);
                returnImageRepository.save(returnImage);
            }
        }

        // Update order status
        order.setStatus("RETURN_REQUESTED");
        orderRepository.save(order);

        // Notify admins about new return request
        try {
            notificationService.sendToAdmins(
                NotificationMessage.builder()
                    .type("RETURN_REQUESTED")
                    .title("New Return Request")
                    .message("New return request #" + savedReturn.getId() + " for order #" + order.getId())
                    .data(java.util.Map.of("returnId", savedReturn.getId(), "orderId", order.getId()))
                    .build()
            );
        } catch (Exception e) {
            log.warn("Failed to send return request notification: {}", e.getMessage());
        }

        return getReturnById(savedReturn.getId());
    }

    /**
     * Get return by ID with full details
     */
    public ReturnResponse getReturnById(Integer returnId) {
        Return returnRequest = returnRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found"));

        return convertToResponse(returnRequest);
    }

    /**
     * Get return by order ID
     */
    public ReturnResponse getReturnByOrderId(Integer orderId) {
        Return returnRequest = returnRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found for this order"));

        return convertToResponse(returnRequest);
    }

    /**
     * Get all returns by customer
     */
    public List<ReturnResponse> getReturnsByCustomer(Integer customerId) {
        return returnRepository.findByCustomerId(customerId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all returns by status
     */
    public List<ReturnResponse> getReturnsByStatus(ReturnStatus status) {
        return returnRepository.findByStatus(status).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all pending returns
     */
    public List<ReturnResponse> getPendingReturns() {
        return returnRepository.findPendingReturns().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all returns
     */
    public List<ReturnResponse> getAllReturns() {
        return returnRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Process return request (admin action)
     */
    @Transactional
    public ReturnResponse processReturn(Integer returnId, Integer adminId, ProcessReturnRequest request) {
        Return returnRequest = returnRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found"));

        if (returnRequest.getStatus() != ReturnStatus.PENDING) {
            throw new RuntimeException("Only pending returns can be processed");
        }

        returnRequest.setStatus(request.getStatus());
        returnRequest.setAdminNotes(request.getAdminNotes());
        returnRequest.setProcessedBy(adminId);
        returnRequest.setProcessedAt(LocalDateTime.now());

        if (request.getStatus() == ReturnStatus.APPROVED) {
            returnRequest.setRefundAmount(request.getRefundAmount());
        }

        returnRepository.save(returnRequest);
        log.info("Return {} processed by admin {}: status={}", returnId, adminId, request.getStatus());

        // Update order status based on return status
        Order order = orderRepository.findById(returnRequest.getOrderId()).orElse(null);
        if (order != null) {
            if (request.getStatus() == ReturnStatus.APPROVED) {
                order.setStatus("RETURN_APPROVED");
            } else if (request.getStatus() == ReturnStatus.REJECTED) {
                order.setStatus("DELIVERED"); // Revert to delivered
            }
            orderRepository.save(order);
        }

        // Notify customer about return status
        if (order != null) {
            try {
                String statusMessage = request.getStatus() == ReturnStatus.APPROVED 
                    ? "Your return request has been approved" 
                    : "Your return request has been rejected";
                notificationService.sendToUser(
                    order.getUserId().toString(),
                    NotificationMessage.builder()
                        .type("RETURN_PROCESSED")
                        .title("Return Request Update")
                        .message(statusMessage + " for order #" + order.getId())
                        .data(java.util.Map.of("returnId", returnId, "status", request.getStatus().name()))
                        .build()
                );
            } catch (Exception e) {
                log.warn("Failed to send return processed notification: {}", e.getMessage());
            }
        }

        return getReturnById(returnId);
    }

    /**
     * Complete refund (admin action)
     */
    @Transactional
    public ReturnResponse completeRefund(Integer returnId, Integer adminId) {
        Return returnRequest = returnRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found"));

        if (returnRequest.getStatus() != ReturnStatus.APPROVED && 
            returnRequest.getStatus() != ReturnStatus.PROCESSING) {
            throw new RuntimeException("Only approved or processing returns can be completed");
        }

        returnRequest.setStatus(ReturnStatus.REFUNDED);
        returnRequest.setCompletedAt(LocalDateTime.now());
        returnRepository.save(returnRequest);

        // Restore stock for returned items
        List<ReturnItem> returnItems = returnItemRepository.findByReturnId(returnId);
        for (ReturnItem item : returnItems) {
            OrderItem orderItem = orderItemRepository.findById(item.getOrderItemId()).orElse(null);
            if (orderItem != null) {
                ProductVariant variant = productVariantRepository.findById(orderItem.getProductVariantId()).orElse(null);
                if (variant != null) {
                    variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                    productVariantRepository.save(variant);
                    log.info("Restored {} units of variant {} to stock", item.getQuantity(), variant.getId());
                }
            }
        }

        // Update order status
        Order order = orderRepository.findById(returnRequest.getOrderId()).orElse(null);
        if (order != null) {
            order.setStatus("REFUNDED");
            orderRepository.save(order);

            // Notify customer
            try {
                notificationService.sendToUser(
                    order.getUserId().toString(),
                    NotificationMessage.builder()
                        .type("REFUND_COMPLETED")
                        .title("Refund Completed")
                        .message("Your refund of " + returnRequest.getRefundAmount() + " VND has been processed")
                        .data(java.util.Map.of("returnId", returnId, "amount", returnRequest.getRefundAmount()))
                        .build()
                );
            } catch (Exception e) {
                log.warn("Failed to send refund completed notification: {}", e.getMessage());
            }
        }

        log.info("Return {} refund completed by admin {}", returnId, adminId);
        return getReturnById(returnId);
    }

    /**
     * Cancel return request (customer action)
     */
    @Transactional
    public ReturnResponse cancelReturn(Integer returnId, Integer customerId) {
        Return returnRequest = returnRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found"));

        // Verify customer owns this return
        Order order = orderRepository.findById(returnRequest.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUserId().equals(customerId)) {
            throw new RuntimeException("You can only cancel your own return requests");
        }

        if (returnRequest.getStatus() != ReturnStatus.PENDING) {
            throw new RuntimeException("Only pending returns can be cancelled");
        }

        returnRequest.setStatus(ReturnStatus.CANCELLED);
        returnRepository.save(returnRequest);

        // Revert order status
        order.setStatus("DELIVERED");
        orderRepository.save(order);

        log.info("Return {} cancelled by customer {}", returnId, customerId);
        return getReturnById(returnId);
    }

    /**
     * Get return statistics for dashboard
     */
    public ReturnStatistics getReturnStatistics() {
        ReturnStatistics stats = new ReturnStatistics();
        stats.setPending(returnRepository.countByStatus(ReturnStatus.PENDING));
        stats.setApproved(returnRepository.countByStatus(ReturnStatus.APPROVED));
        stats.setRejected(returnRepository.countByStatus(ReturnStatus.REJECTED));
        stats.setRefunded(returnRepository.countByStatus(ReturnStatus.REFUNDED));
        stats.setTotal(returnRepository.count());
        return stats;
    }

    /**
     * Convert entity to response DTO
     */
    private ReturnResponse convertToResponse(Return returnRequest) {
        ReturnResponse response = new ReturnResponse();
        response.setId(returnRequest.getId());
        response.setOrderId(returnRequest.getOrderId());
        response.setReason(returnRequest.getReason());
        response.setStatus(returnRequest.getStatus());
        response.setReturnType(returnRequest.getReturnType());
        response.setRefundAmount(returnRequest.getRefundAmount());
        response.setRefundMethod(returnRequest.getRefundMethod());
        response.setBankAccountNumber(returnRequest.getBankAccountNumber());
        response.setBankName(returnRequest.getBankName());
        response.setAccountHolderName(returnRequest.getAccountHolderName());
        response.setAdminNotes(returnRequest.getAdminNotes());
        response.setProcessedBy(returnRequest.getProcessedBy());
        response.setProcessedAt(returnRequest.getProcessedAt());
        response.setCompletedAt(returnRequest.getCompletedAt());
        response.setCreatedAt(returnRequest.getCreatedAt());
        response.setUpdatedAt(returnRequest.getUpdatedAt());

        // Get processor name
        if (returnRequest.getProcessedBy() != null) {
            userRepository.findById(returnRequest.getProcessedBy())
                    .ifPresent(user -> response.setProcessorName(user.getFullName()));
        }

        // Get order info
        orderRepository.findById(returnRequest.getOrderId()).ifPresent(order -> {
            response.setOrderStatus(order.getStatus());
            response.setOrderTotal(order.getTotalAmount());
            response.setCustomerId(order.getUserId());
            
            userRepository.findById(order.getUserId()).ifPresent(user -> {
                response.setCustomerName(user.getFullName());
                response.setCustomerEmail(user.getEmail());
            });
        });

        // Get return items
        List<ReturnItem> items = returnItemRepository.findByReturnId(returnRequest.getId());
        List<ReturnResponse.ReturnItemResponse> itemResponses = new ArrayList<>();
        for (ReturnItem item : items) {
            ReturnResponse.ReturnItemResponse itemResponse = new ReturnResponse.ReturnItemResponse();
            itemResponse.setId(item.getId());
            itemResponse.setOrderItemId(item.getOrderItemId());
            itemResponse.setQuantity(item.getQuantity());
            itemResponse.setReason(item.getReason());
            itemResponse.setConditionStatus(item.getConditionStatus());

            // Get product info from order item
            orderItemRepository.findById(item.getOrderItemId()).ifPresent(orderItem -> {
                itemResponse.setPrice(orderItem.getPrice());
                productVariantRepository.findById(orderItem.getProductVariantId()).ifPresent(variant -> {
                    itemResponse.setVariantName(variant.getName());
                    if (variant.getProduct() != null) {
                        itemResponse.setProductName(variant.getProduct().getName());
                    }
                });
            });

            itemResponses.add(itemResponse);
        }
        response.setItems(itemResponses);

        // Get return images
        List<ReturnImage> images = returnImageRepository.findByReturnId(returnRequest.getId());
        List<ReturnResponse.ReturnImageResponse> imageResponses = images.stream()
                .map(image -> {
                    ReturnResponse.ReturnImageResponse imageResponse = new ReturnResponse.ReturnImageResponse();
                    imageResponse.setId(image.getId());
                    imageResponse.setImageUrl(image.getImageUrl());
                    imageResponse.setDescription(image.getDescription());
                    imageResponse.setCreatedAt(image.getCreatedAt());
                    return imageResponse;
                })
                .collect(Collectors.toList());
        response.setImages(imageResponses);

        return response;
    }

    /**
     * Statistics DTO
     */
    @lombok.Data
    public static class ReturnStatistics {
        private Long pending;
        private Long approved;
        private Long rejected;
        private Long refunded;
        private Long total;
    }
}
