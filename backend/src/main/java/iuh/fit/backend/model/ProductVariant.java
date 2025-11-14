package iuh.fit.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

// Product Variant Entity
@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "product_id")
    private Integer productId;

    private String name;
    private String sku;
    private Double price;

    @Column(name = "sale_price")
    private Double salePrice;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @OneToOne
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    @JsonIgnore
    private Product product;  // Đổi từ @ManyToOne sang @OneToOne

    @OneToMany(mappedBy = "productVariant")
    @JsonIgnore
    private List<VariantAttribute> variantAttributes;//co

    // Đổi từ OneToMany sang OneToOne
    @OneToOne(mappedBy = "productVariant")
    @JsonIgnore
    private CartItem cartItem;

    // Đổi từ OneToMany sang OneToOne
    @OneToOne(mappedBy = "productVariant")
    @JsonIgnore
    private OrderItem orderItem;

    @ManyToOne
    @JoinColumn(name = "favorite_id", insertable = false, updatable = false)
    private FavoriteList favoriteList;
}
