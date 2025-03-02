package com.agro.service;

import java.time.LocalDateTime;
import java.util.List;

import com.agro.dto.OfflineSaleDto;
import com.agro.model.OfflineSale;

public interface OfflineSaleService {
    OfflineSale createSale(OfflineSaleDto saleDto);
    OfflineSale getSaleById(Long id);
    List<OfflineSale> getAllSales();
    List<OfflineSale> getSalesByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    OfflineSaleDto convertToDto(OfflineSale sale);
}
