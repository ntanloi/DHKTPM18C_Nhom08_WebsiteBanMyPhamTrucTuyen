package iuh.fit.backend.repository;

import iuh.fit.backend.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Integer> {
    List<PaymentMethod> findByIsActiveTrue();
    Optional<PaymentMethod> findByCode(String code);
}
