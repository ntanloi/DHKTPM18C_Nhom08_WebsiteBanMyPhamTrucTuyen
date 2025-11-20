    package iuh.fit.backend.model;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    // Variant Attribute Entity
    @Entity
    @Table(name = "variant_attributes")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class VariantAttribute {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @Column(name = "product_variant_id")
        private Integer productVariantId;

        private String name;
        private String value;

        @ManyToOne
        @JoinColumn(name = "product_variant_id", insertable = false, updatable = false)
        @JsonIgnore
        private ProductVariant productVariant;
    }
