package iuh.fit.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import iuh.fit.backend.model.enums.ItemCondition;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * ReturnItem Entity - Represents individual items in a return request
 */
@Entity
@Table(name = "return_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReturnItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "return_id")
    private Integer returnId;

    @Column(name = "order_item_id")
    private Integer orderItemId;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_status", length = 50)
    private ItemCondition conditionStatus = ItemCondition.UNOPENED;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "return_id", insertable = false, updatable = false)
    @JsonIgnore
    private Return returnRequest;

    @ManyToOne
    @JoinColumn(name = "order_item_id", insertable = false, updatable = false)
    private OrderItem orderItem;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (quantity == null) {
            quantity = 1;
        }
        if (conditionStatus == null) {
            conditionStatus = ItemCondition.UNOPENED;
        }
    }
}
