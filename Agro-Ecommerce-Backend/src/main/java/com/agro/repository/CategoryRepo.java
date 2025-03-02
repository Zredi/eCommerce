package com.agro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.Category;

public interface CategoryRepo extends JpaRepository<Category, Long> {

    Category findByName(String name);

    boolean existsByName(String name);

}
