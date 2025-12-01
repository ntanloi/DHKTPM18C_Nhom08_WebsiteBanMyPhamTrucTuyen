package iuh.fit.backend.model.enums;

/**
 * Condition status of returned item
 */
public enum ItemCondition {
    UNOPENED,     // Product is still sealed, never opened
    OPENED,       // Product has been opened but unused
    LIGHTLY_USED, // Product has been lightly used
    DAMAGED,      // Product is damaged
    DEFECTIVE     // Product has manufacturing defect
}
