package iuh.fit.backend.repository;

import iuh.fit.backend.model.VariantAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariantAttributeRepository extends JpaRepository<VariantAttribute, Integer> {
    List<VariantAttribute> findByProductVariantId(Integer productVariantId);
}