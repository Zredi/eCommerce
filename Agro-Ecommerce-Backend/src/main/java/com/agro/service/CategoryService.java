package com.agro.service;

import java.util.*;

import com.agro.model.Category;
import com.agro.model.SubCategory;

public interface CategoryService {

    Category getCategoryById(Long id);

    Category getCategoryByName(String name);

    List<Category> getAllCategories();

    Category addCategory(Category category);

    Category updateCategory(Category category, Long id);

    void deleteCategoryById(Long id);
    
}
