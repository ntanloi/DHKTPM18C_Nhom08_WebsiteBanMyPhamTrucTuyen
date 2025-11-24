package iuh.fit.backend.service;

import iuh.fit.backend.dto.UserResponse;
import iuh.fit.backend.model.Role;
import iuh.fit.backend.model.User;
import iuh.fit.backend.repository.RoleRepository;
import iuh.fit.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminUserService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<UserResponse> getAllUsers(int page, int size, String search, String roleName) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<User> users;
        if (search != null && !search.isBlank()) {
            users = userRepository.findByEmailContainingOrFullNameContaining(
                    search, search, pageable);
        } else if (roleName != null && !roleName.isBlank()) {
            users = userRepository.findByRoleName(roleName, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        
        return users.map(this::convertToUserResponse);
    }

    @Transactional
    public UserResponse updateUserRole(Integer userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!roleName.matches("USER|MANAGER|ADMIN")) {
            throw new RuntimeException("Invalid role name. Must be USER, MANAGER, or ADMIN");
        }
        
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        
        user.setRole(role);
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        log.info("User {} role updated to {}", userId, roleName);
        
        return convertToUserResponse(updatedUser);
    }

    @Transactional
    public UserResponse toggleUserStatus(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsActive(!user.getIsActive());
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        log.info("User {} status toggled to {}", userId, updatedUser.getIsActive());
        
        return convertToUserResponse(updatedUser);
    }

    public Map<String, Object> getUserStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countByIsActive(true));
        stats.put("inactiveUsers", userRepository.countByIsActive(false));
        stats.put("userCount", userRepository.countByRoleName("USER"));
        stats.put("managerCount", userRepository.countByRoleName("MANAGER"));
        stats.put("adminCount", userRepository.countByRoleName("ADMIN"));
        
        return stats;
    }

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setBirthDay(user.getBirthDay());
        response.setIsActive(user.getIsActive());
        response.setEmailVerifiedAt(user.getEmailVerifiedAt());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        if (user.getRole() != null) {
            response.setRoleName(user.getRole().getName());
        }
        return response;
    }
}
