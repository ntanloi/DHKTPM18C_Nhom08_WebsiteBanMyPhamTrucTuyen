package iuh.fit.backend.repository;

import iuh.fit.backend.model.RecipientInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecipientInformationRepository extends JpaRepository<RecipientInformation, Integer> {
    Optional<RecipientInformation> findByOrderId(Integer orderId);
}
