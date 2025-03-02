package com.agro.service.impl;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.agro.dto.StockDto;
import com.agro.model.Stock;
import com.agro.repository.StockRepo;
import com.agro.service.AdminService;
import com.agro.service.NotificationService;
import com.agro.service.StockService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {
	
	private final StockRepo stockRepo;
	private final ModelMapper modelMapper;
	private final NotificationService notificationService;
	private final AdminService adminService;
	
	private static final int LOW_STOCK_THRESHOLD = 10;

	@Override
	public List<Stock> getAllStocks() {
		List<Stock> stocks = stockRepo.findAll();
        checkLowStockLevels(stocks);
        return stocks;
	}

	@Override
	public StockDto convertToDto(Stock stock) {
		return modelMapper.map(stock, StockDto.class);
	}

	@Override
	public Stock getStockByProductId(Long productId) {
		Stock stock = stockRepo.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Stock not found"));
//        checkLowStockLevel(stock);
        return stock;
	}
	
	private void checkLowStockLevels(List<Stock> stocks) {
        stocks.forEach(this::checkLowStockLevel);
    }
    
    private void checkLowStockLevel(Stock stock) {
        if (stock.getCurrentStock() < LOW_STOCK_THRESHOLD) {
            notifyAdminsAboutLowStock(stock);
        }
    }
    
    private void notifyAdminsAboutLowStock(Stock stock) {
        String message = String.format(
            "LOW STOCK ALERT: Product '%s' (ID: %d) has low stock! Current stock: %d units",
            stock.getProduct().getName(),
            stock.getProduct().getId(),
            stock.getCurrentStock()
        );
        
        List<Long> adminIds = adminService.getAdminUserIds();
        
        if (adminIds.isEmpty()) {
            log.warn("No admin users found in the system for low stock notification");
            return;
        }
        
        for (Long adminId : adminIds) {
            try {
                notificationService.sendNotification(adminId, message);
            } catch (Exception e) {
                log.error("Failed to send low stock notification to admin ID: " + adminId, e);
            }
        }
    }

}
