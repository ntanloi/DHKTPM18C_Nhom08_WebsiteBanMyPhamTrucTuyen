package iuh.fit.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import iuh.fit.backend.model.ChatRoom;
import iuh.fit.backend.model.enums.RoomStatus;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {

    // Find active (non-closed) rooms for a customer
    @Query("SELECT c FROM ChatRoom c WHERE c.customerId = :customerId AND c.status NOT IN ('CLOSED') ORDER BY c.createdAt DESC")
    List<ChatRoom> findActiveRoomsByCustomerId(@Param("customerId") Integer customerId);

    // Find rooms by customer and status
    List<ChatRoom> findByCustomerIdAndStatus(Integer customerId, RoomStatus status);

    // Find rooms by status
    List<ChatRoom> findByStatusOrderByCreatedAtAsc(RoomStatus status);
    
    // Find rooms assigned to a manager
    List<ChatRoom> findByManagerIdAndStatusOrderByUpdatedAtDesc(Integer managerId, RoomStatus status);

    // Find pending rooms without assigned manager
    @Query("SELECT c FROM ChatRoom c WHERE c.status = 'PENDING' AND c.managerId IS NULL ORDER BY c.createdAt ASC")
    List<ChatRoom> findPendingRoomsWithoutManager();
    
    // Find all active rooms for a manager (currently supporting)
    @Query("SELECT c FROM ChatRoom c WHERE c.managerId = :managerId AND c.status IN ('ASSIGNED', 'PENDING') ORDER BY c.updatedAt DESC")
    List<ChatRoom> findActiveRoomsByManagerId(@Param("managerId") Integer managerId);

    // Count pending rooms
    @Query("SELECT COUNT(c) FROM ChatRoom c WHERE c.status = 'PENDING' AND c.managerId IS NULL")
    long countPendingRooms();
}
