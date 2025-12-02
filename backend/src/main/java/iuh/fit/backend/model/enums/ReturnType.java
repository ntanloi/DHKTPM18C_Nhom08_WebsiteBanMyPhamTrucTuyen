package iuh.fit.backend.model.enums;

/**
 * Return type enum - defines what kind of return action is requested
 */
public enum ReturnType {
    REFUND,    // Customer wants money back
    EXCHANGE,  // Customer wants to exchange for another product
    REPAIR     // Customer wants the product repaired
}
