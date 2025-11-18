package iuh.fit.backend.service;

import iuh.fit.backend.dto.VariantAttributeRequest;
import iuh.fit.backend.dto.VariantAttributeResponse;
import iuh.fit.backend.model.VariantAttribute;
import iuh.fit.backend.repository.VariantAttributeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VariantAttributeService {

    @Autowired
    private VariantAttributeRepository variantAttributeRepository;

    public List<VariantAttributeResponse> getAllVariantAttributes() {
        return variantAttributeRepository.findAll().stream()
                .map(this::convertToVariantAttributeResponse)
                .collect(Collectors.toList());
    }

    public VariantAttributeResponse getVariantAttributeById(Integer attributeId) {
        VariantAttribute attribute = variantAttributeRepository.findById(attributeId)
                .orElseThrow(() -> new RuntimeException("Variant attribute not found"));
        return convertToVariantAttributeResponse(attribute);
    }

    public List<VariantAttributeResponse> getVariantAttributesByProductVariantId(Integer productVariantId) {
        return variantAttributeRepository.findByProductVariantId(productVariantId).stream()
                .map(this::convertToVariantAttributeResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VariantAttributeResponse createVariantAttribute(VariantAttributeRequest request) {
        VariantAttribute attribute = new VariantAttribute();
        attribute.setProductVariantId(request.getProductVariantId());
        attribute.setName(request.getName());
        attribute.setValue(request.getValue());

        VariantAttribute savedAttribute = variantAttributeRepository.save(attribute);
        return convertToVariantAttributeResponse(savedAttribute);
    }

    @Transactional
    public VariantAttributeResponse updateVariantAttribute(Integer attributeId, VariantAttributeRequest request) {
        VariantAttribute attribute = variantAttributeRepository.findById(attributeId)
                .orElseThrow(() -> new RuntimeException("Variant attribute not found"));

        attribute.setProductVariantId(request.getProductVariantId());
        attribute.setName(request.getName());
        attribute.setValue(request.getValue());

        VariantAttribute updatedAttribute = variantAttributeRepository.save(attribute);
        return convertToVariantAttributeResponse(updatedAttribute);
    }

    @Transactional
    public void deleteVariantAttribute(Integer attributeId) {
        VariantAttribute attribute = variantAttributeRepository.findById(attributeId)
                .orElseThrow(() -> new RuntimeException("Variant attribute not found"));
        variantAttributeRepository.delete(attribute);
    }

    private VariantAttributeResponse convertToVariantAttributeResponse(VariantAttribute attribute) {
        VariantAttributeResponse response = new VariantAttributeResponse();
        response.setId(attribute.getId());
        response.setName(attribute.getName());
        response.setValue(attribute.getValue());
        return response;
    }
}