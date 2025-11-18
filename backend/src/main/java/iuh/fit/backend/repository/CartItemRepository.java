package iuh.fit.backend.repository;

import iuh.fit.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCartId(Integer cartId);
    Optional<CartItem> findByCartIdAndProductVariantId(Integer cartId, Integer productVariantId);
    void deleteByCartId(Integer cartId);
}