package com.agro.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.agro.dto.InventoryDto;
import com.agro.model.Inventory;
import com.agro.model.Stock;
import com.agro.request.RestockingRequest;
import com.agro.service.InventoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/inventories")
public class InventoryController {

	private final InventoryService inventoryService;
	
	@GetMapping("/all")
    public ResponseEntity<List<InventoryDto>> getAllStocks() {
        List<Inventory> inventories = inventoryService.getAllInventories();
        List<InventoryDto> inventoryDtos = inventories.stream()
                .map(inventoryService::convertToDto)
                .toList();
        return ResponseEntity.ok(inventoryDtos);
    }
	
	@PostMapping("/restock")
    public ResponseEntity<InventoryDto> addRestockingRecord(@RequestBody RestockingRequest request) {
        Inventory inventory = inventoryService.addRestockingRecord(request);
        InventoryDto inventoryDto = inventoryService.convertToDto(inventory);
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryDto);
    }
	
//	 @GetMapping("/product/{productId}")
//	    public ResponseEntity<List<Inventory>> getInventoryByProduct(@PathVariable Long productId) {
//	        return ResponseEntity.ok(inventoryService.getInventoryByProduct(productId));
//	    }
	 
	 @GetMapping("/date-range")
	    public ResponseEntity<List<Inventory>> getInventoryByDateRange(
	            @RequestParam LocalDateTime startDate,
	            @RequestParam LocalDateTime endDate) {
	        return ResponseEntity.ok(inventoryService.getInventoryByDateRange(startDate, endDate));
	    }
	 
//	 @GetMapping("/latest-stock")
//	 public ResponseEntity<List<Inventory>> getLatestStock() {
//	     return ResponseEntity.ok(inventoryService.getLatestStock());
//	 }
}
