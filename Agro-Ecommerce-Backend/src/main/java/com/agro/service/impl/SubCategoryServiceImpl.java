package com.agro.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.agro.model.Category;
import com.agro.model.SubCategory;
import com.agro.repository.CategoryRepo;
import com.agro.repository.SubCategoryRepo;
import com.agro.service.SubCategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubCategoryServiceImpl implements SubCategoryService {
	
	private final CategoryRepo categoryRepo; 
	private final SubCategoryRepo subCategoryRepo;

	@Override
	public SubCategory getSubCategoryById(Long id) {
		return subCategoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found!"));
	}

	@Override
	public SubCategory getSubCategoryByName(String name) {
		return subCategoryRepo.findByName(name);
	}

	@Override
	public List<SubCategory> getAllSubCategories() {
		return subCategoryRepo.findAll();
	}

	@Override
	public List<SubCategory> getSubCategoriesByCategory(String categoryName) {
		Category category = categoryRepo.findByName(categoryName);
		return category.getSubCategories();
	}

	@Override
	public SubCategory addSubCategoryToCategory(Long categoryId, SubCategory subCategory) {
		Category category = categoryRepo.findById(categoryId)
				.orElseThrow(()-> new RuntimeException("Category not found!"));
		subCategory.setCategory(category);
		return subCategoryRepo.save(subCategory);
	}

	@Override
	public SubCategory updateSubCategoryInCategory(Long categoryId, Long subCategoryId, SubCategory subCategory) {
		Category category = categoryRepo.findById(categoryId)
				.orElseThrow(()-> new RuntimeException("Category not found!"));
		SubCategory existSubCategory = subCategoryRepo.findById(subCategoryId)
				.orElseThrow(()-> new RuntimeException("SubCategory not found!"));
		existSubCategory.setName(subCategory.getName());
		existSubCategory.setCategory(category);
		return subCategoryRepo.save(existSubCategory);
	}

	@Override
	public void deleteSubCategoryById(Long subCategoryId) {
		SubCategory subCategory = subCategoryRepo.findById(subCategoryId)
				.orElseThrow(()-> new RuntimeException("SubCategory not found!"));
		subCategoryRepo.delete(subCategory);
		
	}

}
