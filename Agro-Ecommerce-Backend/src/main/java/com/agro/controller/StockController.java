package com.agro.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.agro.dto.StockDto;
import com.agro.model.Stock;
import com.agro.service.StockService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/stocks")
public class StockController {

	private final StockService stockService;
	
	@GetMapping("/all")
    public ResponseEntity<List<StockDto>> getAllStocks() {
        List<Stock> stocks = stockService.getAllStocks();
        List<StockDto> stockDtos = stocks.stream()
        		.map(stockService::convertToDto)
        		.toList();
        return ResponseEntity.ok(stockDtos);
    }
	
	@GetMapping("/{productId}")
	public ResponseEntity<StockDto> getStockByProductId(@PathVariable Long productId){
		Stock stock = stockService.getStockByProductId(productId);
		StockDto stockDto = stockService.convertToDto(stock);
		return ResponseEntity.ok(stockDto);
	}
}
