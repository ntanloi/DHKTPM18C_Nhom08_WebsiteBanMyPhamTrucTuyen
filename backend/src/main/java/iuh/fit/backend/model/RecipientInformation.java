package iuh.fit.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Recipient Information Entity
@Entity
@Table(name = "recipient_information")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipientInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "recipient_phone")
    private String recipientPhone;

    @Column(name = "shipping_recipient_address")
    private String shippingRecipientAddress;

    @Column(name = "recipient_first_name")
    private String recipientFirstName;

    @Column(name = "recipient_last_name")
    private String recipientLastName;

    @Column(name = "recipient_email")
    private String recipientEmail;

    @Column(name = "is_another_receiver")
    private Boolean isAnotherReceiver;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToOne
    @JoinColumn(name = "order_id", insertable = false, updatable = false)  // Cần thêm column order_id
    @JsonIgnore
    private Order order;
}
