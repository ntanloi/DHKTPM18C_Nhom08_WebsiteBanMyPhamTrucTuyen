package iuh.fit.backend.service;

import iuh.fit.backend.dto.AddressResponse;
import iuh.fit.backend.dto.CreateAddressRequest;
import iuh.fit.backend.dto.UpdateAddressRequest;
import iuh.fit.backend.model.Address;
import iuh.fit.backend.repository.AddressRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Transactional
    public AddressResponse createAddress(Integer userId, CreateAddressRequest request) {
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.findByUserIdAndIsDefault(userId, true)
                    .ifPresent(existingDefault -> {
                        existingDefault.setIsDefault(false);
                        existingDefault.setUpdatedAt(LocalDateTime.now());
                        addressRepository.save(existingDefault);
                    });
        }

        Address address = new Address();
        address.setUserId(userId);
        address.setRecipientName(request.getRecipientName());
        address.setRecipientPhone(request.getRecipientPhone());
        address.setStreetAddress(request.getStreetAddress());
        address.setWard(request.getWard());
        address.setDistrict(request.getDistrict());
        address.setCity(request.getCity());
        address.setIsDefault(request.getIsDefault() != null ? request.getIsDefault() : false);
        address.setCreatedAt(LocalDateTime.now());
        address.setUpdatedAt(LocalDateTime.now());

        Address savedAddress = addressRepository.save(address);
        return convertToAddressResponse(savedAddress);
    }

    public AddressResponse getAddressById(Integer addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        return convertToAddressResponse(address);
    }

    public List<AddressResponse> getAddressesByUserId(Integer userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(this::convertToAddressResponse)
                .collect(Collectors.toList());
    }

    public AddressResponse getDefaultAddress(Integer userId) {
        Address address = addressRepository.findByUserIdAndIsDefault(userId, true)
                .orElseThrow(() -> new RuntimeException("Default address not found"));
        return convertToAddressResponse(address);
    }

    @Transactional
    public AddressResponse updateAddress(Integer addressId, UpdateAddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (Boolean.TRUE.equals(request.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            addressRepository.findByUserIdAndIsDefault(address.getUserId(), true)
                    .ifPresent(existingDefault -> {
                        existingDefault.setIsDefault(false);
                        existingDefault.setUpdatedAt(LocalDateTime.now());
                        addressRepository.save(existingDefault);
                    });
        }

        if (request.getRecipientName() != null) {
            address.setRecipientName(request.getRecipientName());
        }
        if (request.getRecipientPhone() != null) {
            address.setRecipientPhone(request.getRecipientPhone());
        }
        if (request.getStreetAddress() != null) {
            address.setStreetAddress(request.getStreetAddress());
        }
        if (request.getWard() != null) {
            address.setWard(request.getWard());
        }
        if (request.getDistrict() != null) {
            address.setDistrict(request.getDistrict());
        }
        if (request.getCity() != null) {
            address.setCity(request.getCity());
        }
        if (request.getIsDefault() != null) {
            address.setIsDefault(request.getIsDefault());
        }
        address.setUpdatedAt(LocalDateTime.now());

        Address updatedAddress = addressRepository.save(address);
        return convertToAddressResponse(updatedAddress);
    }

    @Transactional
    public void deleteAddress(Integer addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        addressRepository.delete(address);
    }

    private AddressResponse convertToAddressResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setUserId(address.getUserId());
        response.setRecipientName(address.getRecipientName());
        response.setRecipientPhone(address.getRecipientPhone());
        response.setStreetAddress(address.getStreetAddress());
        response.setWard(address.getWard());
        response.setDistrict(address.getDistrict());
        response.setCity(address.getCity());
        response.setIsDefault(address.getIsDefault());
        response.setCreatedAt(address.getCreatedAt());
        response.setUpdatedAt(address.getUpdatedAt());
        return response;
    }
}