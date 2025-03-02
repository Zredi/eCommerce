package com.agro.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.agro.dto.InventoryDto;
import com.agro.model.Inventory;
import com.agro.request.RestockingRequest;

public interface InventoryService {
	
	List<Inventory> getAllInventories();

	Inventory addRestockingRecord(RestockingRequest request);
	
//	List<Inventory> getInventoryByProduct(Long productId);
	
	List<Inventory> getInventoryByDateRange(LocalDateTime startDate, LocalDateTime endDate);
	
//	List<Inventory> getLatestStock();
	
	InventoryDto convertToDto(Inventory inventory);
	
}
