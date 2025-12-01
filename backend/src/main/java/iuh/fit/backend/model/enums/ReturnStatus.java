package iuh.fit.backend.model.enums;

/**
 * Return request status enum
 */
public enum ReturnStatus {
    PENDING,      // Customer submitted return request, awaiting review
    APPROVED,     // Admin approved the return request
    REJECTED,     // Admin rejected the return request
    PROCESSING,   // Return is being processed (item received, quality check)
    REFUNDED,     // Refund has been completed
    COMPLETED,    // Return process fully completed
    CANCELLED     // Customer cancelled the return request
}
