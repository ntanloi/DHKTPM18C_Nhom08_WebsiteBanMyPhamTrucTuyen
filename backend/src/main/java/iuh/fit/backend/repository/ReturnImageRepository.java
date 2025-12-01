package iuh.fit.backend.repository;

import iuh.fit.backend.model.ReturnImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ReturnImage entity operations
 */
@Repository
public interface ReturnImageRepository extends JpaRepository<ReturnImage, Integer> {

    /**
     * Find all images by return ID
     */
    List<ReturnImage> findByReturnId(Integer returnId);

    /**
     * Delete all images by return ID
     */
    void deleteByReturnId(Integer returnId);
}
