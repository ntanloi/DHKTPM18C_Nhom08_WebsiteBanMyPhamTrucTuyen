package iuh.fit.backend.repository;

import iuh.fit.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    
    // Admin features - search & filter
    Page<User> findByEmailContainingOrFullNameContaining(String email, String fullName, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.role.name = :roleName")
    Page<User> findByRoleName(String roleName, Pageable pageable);
    
    // Statistics
    long countByIsActive(Boolean isActive);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role.name = :roleName")
    long countByRoleName(String roleName);
    
    // Analytics
    Long countByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}