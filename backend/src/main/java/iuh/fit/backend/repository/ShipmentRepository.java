package iuh.fit.backend.repository;

import iuh.fit.backend.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Integer> {
    Optional<Shipment> findByOrderId(Integer orderId);
    Optional<Shipment> findByTrackingCode(String trackingCode);
}
