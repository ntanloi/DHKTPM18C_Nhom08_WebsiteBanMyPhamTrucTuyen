package iuh.fit.backend.repository;

import iuh.fit.backend.model.ProductVariant;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
    List<ProductVariant> findByProductId(Integer productId);

    Optional<ProductVariant> findBySku(String sku);

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Integer id);

    /**
     * Find variant with pessimistic write lock to prevent race conditions
     * when updating stock quantity during concurrent orders.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT pv FROM ProductVariant pv WHERE pv.id = :id")
    Optional<ProductVariant> findByIdForUpdate(@Param("id") Integer id);
    @Query("SELECT pv FROM ProductVariant pv WHERE pv.stockQuantity > 0")
    List<ProductVariant> findInStockVariants();
}
