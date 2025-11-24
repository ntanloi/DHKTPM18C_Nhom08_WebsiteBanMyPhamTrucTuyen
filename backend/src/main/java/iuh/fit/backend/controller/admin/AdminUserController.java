package iuh.fit.backend.controller.admin;

import iuh.fit.backend.dto.UserResponse;
import iuh.fit.backend.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Admin User Management Controller
 * Chỉ ADMIN mới có quyền truy cập
 * 
 * Endpoints:
 * - GET /api/admin/users - Danh sách users với pagination & search
 * - PUT /api/admin/users/{userId}/role - Thay đổi role user
 * - PUT /api/admin/users/{userId}/status - Kích hoạt/vô hiệu hóa user
 */
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class AdminUserController {
    
    private final AdminUserService adminUserService;

    @GetMapping("/get-password")
    public ResponseEntity<Map<String, String>> getPassword() {
        String adminPassword = adminUserService.encodePassword("Admin123@");
        String managerPassword = adminUserService.encodePassword("Manager123@");
        return ResponseEntity.ok(Map.of("admin", adminPassword, "manager", managerPassword));
    }

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {
        
        log.info("Admin fetching users - page: {}, size: {}, search: {}, role: {}", 
                 page, size, search, role);
        
        Page<UserResponse> users = adminUserService.getAllUsers(page, size, search, role);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Integer userId,
            @RequestBody Map<String, String> request) {
        try {
            String roleName = request.get("roleName");
            if (roleName == null || roleName.isBlank()) {
                throw new RuntimeException("Role name is required");
            }
            
            log.info("Admin updating user {} role to {}", userId, roleName);
            
            UserResponse updatedUser = adminUserService.updateUserRole(userId, roleName);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            log.error("Error updating user role: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update user role");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Integer userId) {
        try {
            log.info("Admin toggling user {} status", userId);
            
            UserResponse updatedUser = adminUserService.toggleUserStatus(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User status updated successfully");
            response.put("user", updatedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error toggling user status: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update user status");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats() {
        try {
            Map<String, Object> stats = adminUserService.getUserStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching user stats: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch user statistics");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
