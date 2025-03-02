package com.agro.service;

import java.util.List;

import com.agro.dto.StockDto;
import com.agro.model.Stock;

public interface StockService {

	List<Stock> getAllStocks();
	
	Stock getStockByProductId(Long productId);
	
	StockDto convertToDto(Stock stock);
}
