package iuh.fit.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity for tracking stock changes history
 */
@Entity
@Table(name = "stock_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "variant_id", nullable = false)
    private Integer variantId;

    @Column(name = "previous_quantity", nullable = false)
    private Integer previousQuantity;

    @Column(name = "new_quantity", nullable = false)
    private Integer newQuantity;

    @Column(name = "quantity_change", nullable = false)
    private Integer quantityChange;

    @Column(name = "adjustment_type", nullable = false, length = 20)
    private String adjustmentType; // ADD, SUBTRACT, SET

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "reference_type", length = 50)
    private String referenceType; // ORDER, RETURN, MANUAL, INVENTORY_CHECK

    @Column(name = "reference_id")
    private Integer referenceId;

    @Column(name = "performed_by")
    private Integer performedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", insertable = false, updatable = false)
    private ProductVariant variant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by", insertable = false, updatable = false)
    private User performer;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
