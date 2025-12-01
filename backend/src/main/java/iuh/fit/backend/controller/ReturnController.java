package iuh.fit.backend.controller;

import iuh.fit.backend.dto.CreateReturnRequest;
import iuh.fit.backend.dto.ProcessReturnRequest;
import iuh.fit.backend.dto.ReturnResponse;
import iuh.fit.backend.model.enums.ReturnStatus;
import iuh.fit.backend.security.CustomUserDetails;
import iuh.fit.backend.service.ReturnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Return/Refund operations
 * 
 * Customer endpoints:
 * - POST /api/returns - Create return request
 * - GET /api/returns/my - Get customer's returns
 * - GET /api/returns/{id} - Get return details
 * - POST /api/returns/{id}/cancel - Cancel return request
 * 
 * Admin endpoints:
 * - GET /api/admin/returns - Get all returns
 * - GET /api/admin/returns/pending - Get pending returns
 * - GET /api/admin/returns/statistics - Get return statistics
 * - PUT /api/admin/returns/{id}/process - Process return request
 * - PUT /api/admin/returns/{id}/complete - Complete refund
 */
@RestController
@RequiredArgsConstructor
public class ReturnController {

    private final ReturnService returnService;

    // ==================== CUSTOMER ENDPOINTS ====================

    /**
     * Create a new return request
     */
    @PostMapping("/api/returns")
    public ResponseEntity<ReturnResponse> createReturn(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CreateReturnRequest request) {
        ReturnResponse response = returnService.createReturnRequest(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get current customer's return requests
     */
    @GetMapping("/api/returns/my")
    public ResponseEntity<List<ReturnResponse>> getMyReturns(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ReturnResponse> returns = returnService.getReturnsByCustomer(userDetails.getId());
        return ResponseEntity.ok(returns);
    }

    /**
     * Get return details by ID
     */
    @GetMapping("/api/returns/{id}")
    public ResponseEntity<ReturnResponse> getReturnById(@PathVariable Integer id) {
        ReturnResponse response = returnService.getReturnById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get return by order ID
     */
    @GetMapping("/api/returns/order/{orderId}")
    public ResponseEntity<ReturnResponse> getReturnByOrderId(@PathVariable Integer orderId) {
        ReturnResponse response = returnService.getReturnByOrderId(orderId);
        return ResponseEntity.ok(response);
    }

    /**
     * Cancel a pending return request
     */
    @PostMapping("/api/returns/{id}/cancel")
    public ResponseEntity<ReturnResponse> cancelReturn(
            @PathVariable Integer id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ReturnResponse response = returnService.cancelReturn(id, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * Get all return requests (admin)
     */
    @GetMapping("/api/admin/returns")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ReturnResponse>> getAllReturns() {
        List<ReturnResponse> returns = returnService.getAllReturns();
        return ResponseEntity.ok(returns);
    }

    /**
     * Get pending return requests (admin)
     */
    @GetMapping("/api/admin/returns/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ReturnResponse>> getPendingReturns() {
        List<ReturnResponse> returns = returnService.getPendingReturns();
        return ResponseEntity.ok(returns);
    }

    /**
     * Get returns by status (admin)
     */
    @GetMapping("/api/admin/returns/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ReturnResponse>> getReturnsByStatus(@PathVariable String status) {
        ReturnStatus returnStatus = ReturnStatus.valueOf(status.toUpperCase());
        List<ReturnResponse> returns = returnService.getReturnsByStatus(returnStatus);
        return ResponseEntity.ok(returns);
    }

    /**
     * Get return statistics (admin)
     */
    @GetMapping("/api/admin/returns/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ReturnService.ReturnStatistics> getStatistics() {
        ReturnService.ReturnStatistics stats = returnService.getReturnStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Process return request - approve or reject (admin)
     */
    @PutMapping("/api/admin/returns/{id}/process")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ReturnResponse> processReturn(
            @PathVariable Integer id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ProcessReturnRequest request) {
        ReturnResponse response = returnService.processReturn(id, userDetails.getId(), request);
        return ResponseEntity.ok(response);
    }

    /**
     * Complete refund for approved return (admin)
     */
    @PutMapping("/api/admin/returns/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ReturnResponse> completeRefund(
            @PathVariable Integer id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ReturnResponse response = returnService.completeRefund(id, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Get return details by ID (admin)
     */
    @GetMapping("/api/admin/returns/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ReturnResponse> getReturnByIdAdmin(@PathVariable Integer id) {
        ReturnResponse response = returnService.getReturnById(id);
        return ResponseEntity.ok(response);
    }
}
