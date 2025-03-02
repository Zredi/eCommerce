package com.agro.controller;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agro.model.SubCategory;
import com.agro.response.ApiResponse;
import com.agro.service.SubCategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/subcategories")
public class SubCategoryController {
	
	private final SubCategoryService subCategoryService;
	
	@GetMapping("/subcategory/{id}")
    public ResponseEntity<ApiResponse> getSubCategoryById(@PathVariable Long id){
        try {
            SubCategory subCategory = subCategoryService.getSubCategoryById(id);
            return  ResponseEntity.ok(new ApiResponse("Found", subCategory));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
	
	@GetMapping("/subcategory/{name}/subcategory")
    public ResponseEntity<ApiResponse> getSubCategoryByName(@PathVariable String name){
        try {
            SubCategory subCategory = subCategoryService.getSubCategoryByName(name);
            return  ResponseEntity.ok(new ApiResponse("Found", subCategory));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
	
	@GetMapping
    public ResponseEntity<ApiResponse> getAllSubCategories() {
        try {
            List<SubCategory> subCategories = subCategoryService.getAllSubCategories();
            return  ResponseEntity.ok(new ApiResponse("Found!", subCategories));
        } catch (Exception e) {
           return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error:", INTERNAL_SERVER_ERROR));
        }
    }
	
    @GetMapping("/category/{categoryName}/subcategories") 
    public ResponseEntity<ApiResponse> getSubCategoriesByCategory(@PathVariable String categoryName) { 
    	try { 
    		List<SubCategory> subCategories = subCategoryService.getSubCategoriesByCategory(categoryName);
    		return ResponseEntity.ok(new ApiResponse("Found!", subCategories)); 
    		} catch (Exception e) { 
    			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error:", INTERNAL_SERVER_ERROR)); 
    			} 
    	} 
    @PostMapping("/category/{categoryId}/subcategories/add") 
    public ResponseEntity<ApiResponse> addSubCategoryToCategory(@PathVariable Long categoryId, @RequestBody SubCategory subCategory) { 
    	try { 
    		SubCategory theSubCategory = subCategoryService.addSubCategoryToCategory(categoryId, subCategory); 
    		return ResponseEntity.ok(new ApiResponse("Success", theSubCategory)); 
    		} catch (Exception e) { 
    			return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null)); 
    			} 
    	} 
    @PutMapping("/category/{categoryId}/subcategories/{subCategoryId}/update") 
    public ResponseEntity<ApiResponse> updateSubCategoryInCategory(@PathVariable Long categoryId, @PathVariable Long subCategoryId, @RequestBody SubCategory subCategoryDetails) { 
    	try { 
    		SubCategory updatedSubCategory = subCategoryService.updateSubCategoryInCategory(categoryId, subCategoryId, subCategoryDetails); 
    		return ResponseEntity.ok(new ApiResponse("Update success!", updatedSubCategory)); 
    		} catch (Exception e) { 
    			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null)); 
    			} 
    	} 
    @DeleteMapping("/subcategories/{subCategoryId}/delete") 
    public ResponseEntity<ApiResponse> deleteSubCategory(@PathVariable Long subCategoryId) {
    	try {
    		subCategoryService.deleteSubCategoryById(subCategoryId); 
    		return ResponseEntity.ok(new ApiResponse("Deleted successfully", null)); 
    		} catch (Exception e) { 
    			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null)); 
    			} 
    	}

}
