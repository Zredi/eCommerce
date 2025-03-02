package com.agro.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.agro.model.Category;
import com.agro.model.SubCategory;
import com.agro.repository.CategoryRepo;
import com.agro.repository.SubCategoryRepo;
import com.agro.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepo categoryRepo;

    /**
     * Retrieves a category by its id. If no category is found with the given id, a
     * RuntimeException is thrown.
     * @return the category
     */
    @Override
    public Category getCategoryById(Long id) {
        return categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found!"));
    }

    /**
     * Retrieves a category by its name. If no category is found with the given
     * name, a RuntimeException is thrown.
     * 
     * @return the category
     */
    @Override
    public Category getCategoryByName(String name) {
        return categoryRepo.findByName(name);
    }

    /**
     * Retrieves all categories from the database.
     * 
     * @return the list of all categories
     */
    @Override
    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    /**
     * Adds a new category to the database. If a category with the same name already
     * exists, a RuntimeException is thrown.
     * 
     * @return the created category
     */
    @Override
    public Category addCategory(Category category) {
        if (categoryRepo.existsByName(category.getName())) {
            throw new RuntimeException("Category already exists!");
        }
        return categoryRepo.save(category);
    }

    /**
     * Updates an existing category with the given id. If a category with the given
     * id does not exist, a RuntimeException is thrown.
     * 
     * @return the updated category
     */
    @Override
    public Category updateCategory(Category category, Long id) {
        Category existingCategory = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found!"));
        existingCategory.setName(category.getName());
        return categoryRepo.save(existingCategory);
    }

    /**
     * Deletes a category by its id. If no category is found with the given id, a
     * RuntimeException is thrown.
     */
    @Override
    public void deleteCategoryById(Long id) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found!"));
        categoryRepo.delete(category);
    }

	

}
