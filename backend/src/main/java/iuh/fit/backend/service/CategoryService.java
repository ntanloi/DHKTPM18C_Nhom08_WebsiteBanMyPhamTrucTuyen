package iuh.fit.backend.service;

import iuh.fit.backend.dto.CategoryRequest;
import iuh.fit.backend.dto.CategoryResponse;
import iuh.fit.backend.model.Category;
import iuh.fit.backend.model.Product;
import iuh.fit.backend.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToCategoryResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return convertToCategoryResponse(category);
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return convertToCategoryResponse(category);
    }

    public List<CategoryResponse> getCategoriesByParentId(Integer parentCategoryId) {
        return categoryRepository.findByParentCategoryId(parentCategoryId).stream()
                .map(this::convertToCategoryResponse)
                .collect(Collectors.toList());
    }


    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setParentCategoryId(request.getParentCategoryId());
        category.setImageUrl(request.getImageUrl());
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());

        Category savedCategory = categoryRepository.save(category);
        return convertToCategoryResponse(savedCategory);
    }

    @Transactional
    public CategoryResponse updateCategory(Integer categoryId, CategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setParentCategoryId(request.getParentCategoryId());
        category.setImageUrl(request.getImageUrl());
        category.setUpdatedAt(LocalDateTime.now());

        Category updatedCategory = categoryRepository.save(category);
        return convertToCategoryResponse(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }

    private CategoryResponse convertToCategoryResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setSlug(category.getSlug());
        response.setParentCategoryId(category.getParentCategoryId());
        response.setImageUrl(category.getImageUrl());
        response.setCreatedAt(category.getCreatedAt());
        response.setUpdatedAt(category.getUpdatedAt());
        return response;
    }
}