package iuh.fit.backend.repository;

import iuh.fit.backend.model.ReturnItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ReturnItem entity operations
 */
@Repository
public interface ReturnItemRepository extends JpaRepository<ReturnItem, Integer> {

    /**
     * Find all items by return ID
     */
    List<ReturnItem> findByReturnId(Integer returnId);

    /**
     * Delete all items by return ID
     */
    void deleteByReturnId(Integer returnId);
}
