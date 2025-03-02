package com.agro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.Review;

public interface ReviewRepo extends JpaRepository<Review, Long>{

}
