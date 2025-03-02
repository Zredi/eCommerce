package com.agro.service;

import java.util.List;

import com.agro.model.SubCategory;


public interface SubCategoryService {

	SubCategory getSubCategoryById(Long id);

	SubCategory getSubCategoryByName(String name);

    List<SubCategory> getAllSubCategories();

    List<SubCategory> getSubCategoriesByCategory(String categoryName);
    
    SubCategory addSubCategoryToCategory(Long categoryId, SubCategory subCategory);
    
    SubCategory updateSubCategoryInCategory(Long categoryId, Long subCategoryId, SubCategory subCategory);
    
    void deleteSubCategoryById(Long subCategoryId);
}
