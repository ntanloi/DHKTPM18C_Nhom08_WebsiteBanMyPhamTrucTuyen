package iuh.fit.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Version
    private Long version;  // Optimistic locking for additional safety

    @Column(name = "product_id")
    private Integer productId;

    private String name;
    private String sku;
    private BigDecimal price;

    @Column(name = "sale_price")
    private BigDecimal salePrice;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    @JsonIgnore
    private Product product;

    @OneToMany(mappedBy = "productVariant", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<VariantAttribute> variantAttributes;

    @OneToOne(mappedBy = "productVariant", fetch = FetchType.LAZY)
    @JsonIgnore
    private CartItem cartItem;

    @OneToOne(mappedBy = "productVariant", fetch = FetchType.LAZY)
    @JsonIgnore
    private OrderItem orderItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "favorite_id", insertable = false, updatable = false)
    private FavoriteList favoriteList;
}