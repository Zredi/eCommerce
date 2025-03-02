package com.agro.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.agro.dto.InventoryDto;
import com.agro.model.Inventory;
import com.agro.model.Product;
import com.agro.model.Stock;
import com.agro.repository.InventoryRepo;
import com.agro.repository.ProductRepo;
import com.agro.repository.StockRepo;
import com.agro.request.RestockingRequest;
import com.agro.service.InventoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {
	
	private final InventoryRepo inventoryRepo;
	private final ProductRepo productRepo;
	private final StockRepo stockRepo;
	private final ModelMapper modelMapper;

	
	public Inventory addRestockingRecord(RestockingRequest request) {
        Product product = productRepo.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Stock stock = stockRepo.findByProductId(request.getProductId())
        		.orElseGet(()->{
        			Stock newStock = new Stock();
        			newStock.setProduct(product);
        			newStock.setCurrentStock(0);
        			return stockRepo.save(newStock);
        		});
        int updatedStock = stock.getCurrentStock()+request.getQuantityAdded();
        
        if(updatedStock < 0) {
        	throw new IllegalArgumentException("Stock cannot be negative");
        }
        
        stock.setCurrentStock(updatedStock);
        stockRepo.save(stock);
        
        Inventory inventory = new Inventory();
        inventory.setStock(stock);
        inventory.setQuantityAdded(request.getQuantityAdded());
        inventory.setQuantityAdjusted(0);
        inventory.setTimestamp(LocalDateTime.now());
        inventory.setSource(request.getSource());
        inventory.setReason(request.getReason());
        inventory.setUnitPrice(request.getUnitPrice());
        inventory.setTotalPrice(request.getTotalPrice());

        return inventoryRepo.save(inventory);
    }


//	@Override
//	public List<Inventory> getInventoryByProduct(Long productId) {
//		return inventoryRepo.findByProductId(productId);
//	}


	@Override
	public List<Inventory> getInventoryByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
		return inventoryRepo.findByTimestampBetween(startDate, endDate);
	}


	@Override
	public List<Inventory> getAllInventories() {
		return inventoryRepo.findAll();
	}


	@Override
	public InventoryDto convertToDto(Inventory inventory) {
		return modelMapper.map(inventory, InventoryDto.class);
	}


//	@Override
//	public List<Inventory> getLatestStock() {
//		return inventoryRepo.findLatestStockForAllProducts();
//	}
}
