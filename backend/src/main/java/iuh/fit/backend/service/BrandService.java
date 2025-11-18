package iuh.fit.backend.service;

import iuh.fit.backend.dto.BrandRequest;
import iuh.fit.backend.dto.BrandResponse;
import iuh.fit.backend.model.Brand;
import iuh.fit.backend.repository.BrandRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(this::convertToBrandResponse)
                .collect(Collectors.toList());
    }

    public BrandResponse getBrandById(Integer brandId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        return convertToBrandResponse(brand);
    }

    public BrandResponse getBrandBySlug(String slug) {
        Brand brand = brandRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        return convertToBrandResponse(brand);
    }

    @Transactional
    public BrandResponse createBrand(BrandRequest request) {
        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setSlug(request.getSlug());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setCreatedAt(LocalDateTime.now());
        brand.setUpdatedAt(LocalDateTime.now());

        Brand savedBrand = brandRepository.save(brand);
        return convertToBrandResponse(savedBrand);
    }

    @Transactional
    public BrandResponse updateBrand(Integer brandId, BrandRequest request) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        brand.setName(request.getName());
        brand.setSlug(request.getSlug());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setUpdatedAt(LocalDateTime.now());

        Brand updatedBrand = brandRepository.save(brand);
        return convertToBrandResponse(updatedBrand);
    }

    @Transactional
    public void deleteBrand(Integer brandId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        brandRepository.delete(brand);
    }

    private BrandResponse convertToBrandResponse(Brand brand) {
        BrandResponse response = new BrandResponse();
        response.setId(brand.getId());
        response.setName(brand.getName());
        response.setSlug(brand.getSlug());
        response.setLogoUrl(brand.getLogoUrl());
        response.setCreatedAt(brand.getCreatedAt());
        response.setUpdatedAt(brand.getUpdatedAt());
        return response;
    }
}