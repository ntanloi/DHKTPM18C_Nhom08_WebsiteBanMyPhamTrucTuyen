package iuh.fit.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import iuh.fit.backend.model.PaymentMethod;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Integer> {
    
    List<PaymentMethod> findByIsActiveTrue();
    
    List<PaymentMethod> findByIsActiveTrueOrderBySortOrderAsc();
    
    Optional<PaymentMethod> findByCode(String code);
    
    boolean existsByCode(String code);
}
