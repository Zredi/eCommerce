package com.agro.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.agro.model.Inventory;

public interface InventoryRepo extends JpaRepository<Inventory, Long>{

//	List<Inventory> findByProductId(Long productId);
	
	List<Inventory> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);
	
//	@Query("SELECT i.currentStock FROM Inventory i WHERE i.product.id = :productId ORDER BY i.timestamp DESC LIMIT 1")
//	Optional<Integer> getCurrentStockForProduct(@Param("productId") Long productId);
//	
//	@Query("SELECT i FROM Inventory i " +
//		       "WHERE i.timestamp = (" +
//		       "    SELECT MAX(i2.timestamp) " +
//		       "    FROM Inventory i2 " +
//		       "    WHERE i2.product.id = i.product.id" +
//		       ")")
//	List<Inventory> findLatestStockForAllProducts();
	
}
