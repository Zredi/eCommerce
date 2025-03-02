package com.agro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.SubCategory;

public interface SubCategoryRepo extends JpaRepository<SubCategory, Long> {
	
	SubCategory findByName(String name);

    boolean existsByName(String name);
}
