package com.agro.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.Product;

import java.util.*;

public interface ProductRepo extends JpaRepository<Product, Long>{

	List<Product> findByCategoryName(String categoryName);
	
	List<Product> findBySubCategoryName(String subCategoryName);

    List<Product> findByBrand(String brand);

//    List<Product> findByCategoryNameAndBrand(String category, String brand);

    List<Product> findByName(String name);

    List<Product> findByBrandAndName(String brand, String name);
    
    List<Product> findByIsPopular(String isPopular);

    Long countByBrandAndName(String brand, String name);

    boolean existsByNameAndBrand(String name, String brand);

    List<Product> findByAverageRatingBetween(Double minRating, Double maxRating);
}
