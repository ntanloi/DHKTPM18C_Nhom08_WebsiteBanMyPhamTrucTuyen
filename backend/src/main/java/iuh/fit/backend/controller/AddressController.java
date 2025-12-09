package iuh.fit.backend.controller;

import iuh.fit.backend.dto.AddressResponse;
import iuh.fit.backend.dto.CreateAddressRequest;
import iuh.fit.backend.dto.UpdateAddressRequest;
import iuh.fit.backend.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "*")
public class AddressController {

    @Autowired
    private AddressService addressService;

    // Create address - User can only create address for themselves
    @PreAuthorize("isAuthenticated() and #userId == authentication.principal.userId")
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createAddress(
            @PathVariable Integer userId,
            @RequestBody CreateAddressRequest request) {
        try {
            AddressResponse response = addressService.createAddress(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Get address by ID - Authenticated users only
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{addressId}")
    public ResponseEntity<?> getAddressById(@PathVariable Integer addressId) {
        try {
            AddressResponse response = addressService.getAddressById(addressId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // Get addresses by user ID - User can only get their own addresses
    @PreAuthorize("isAuthenticated() and (#userId == authentication.principal.userId or hasAnyRole('ADMIN', 'MANAGER'))")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressResponse>> getAddressesByUserId(@PathVariable Integer userId) {
        List<AddressResponse> addresses = addressService.getAddressesByUserId(userId);
        return ResponseEntity.ok(addresses);
    }

    // Get default address - User can only get their own default address
    @PreAuthorize("isAuthenticated() and (#userId == authentication.principal.userId or hasAnyRole('ADMIN', 'MANAGER'))")
    @GetMapping("/user/{userId}/default")
    public ResponseEntity<?> getDefaultAddress(@PathVariable Integer userId) {
        try {
            AddressResponse response = addressService.getDefaultAddress(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // Update address - Authenticated users only (ownership checked in service)
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{addressId}")
    public ResponseEntity<?> updateAddress(
            @PathVariable Integer addressId,
            @RequestBody UpdateAddressRequest request) {
        try {
            AddressResponse response = addressService.updateAddress(addressId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Delete address - Authenticated users only (ownership checked in service)
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable Integer addressId) {
        try {
            addressService.deleteAddress(addressId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Address deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}