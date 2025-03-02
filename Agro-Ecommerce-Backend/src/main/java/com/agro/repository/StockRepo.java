package com.agro.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.agro.model.Product;
import com.agro.model.Stock;

public interface StockRepo extends JpaRepository<Stock, Long>{

	Optional<Stock> findByProductId(Long productId);
	
}
