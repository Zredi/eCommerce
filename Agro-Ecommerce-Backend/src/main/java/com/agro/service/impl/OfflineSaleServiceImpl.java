package com.agro.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.agro.dto.OfflineSaleDto;
import com.agro.dto.OfflineSaleItemDto;
import com.agro.model.OfflineSale;
import com.agro.model.OfflineSaleItem;
import com.agro.model.Product;
import com.agro.model.Stock;
import com.agro.repository.OfflineSaleRepo;
import com.agro.repository.ProductRepo;
import com.agro.repository.StockRepo;
import com.agro.service.InvoiceService;
import com.agro.service.OfflineSaleService;


@Service
@RequiredArgsConstructor
public class OfflineSaleServiceImpl implements OfflineSaleService {
    private final OfflineSaleRepo offlineSaleRepo;
    private final ProductRepo productRepo;
    private final StockRepo stockRepo;
    private final ModelMapper modelMapper;
    private final InvoiceService invoiceService;

   @Transactional
    @Override
    public OfflineSale createSale(OfflineSaleDto saleDto) {
        OfflineSale sale = new OfflineSale();
        sale.setSaleDate(LocalDateTime.now());
        sale.setCustomerName(saleDto.getCustomerName());
        sale.setCustomerPhone(saleDto.getCustomerPhone());
        sale.setPaymentMethod(saleDto.getPaymentMethod());
        sale.setGstPercentage(saleDto.getGstPercentage());

        Set<OfflineSaleItem> items = new HashSet<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OfflineSaleItemDto itemDto : saleDto.getItems()) {
            Product product = productRepo.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            Stock stock = stockRepo.findByProductId(product.getId())
                    .orElseThrow(() -> new RuntimeException("Stock not found"));
            
            if (stock.getCurrentStock() < itemDto.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            OfflineSaleItem item = new OfflineSaleItem();
            item.setOfflineSale(sale);
            item.setProduct(product);
            item.setQuantity(itemDto.getQuantity());
            item.setUnitPrice(product.getPrice());
            item.setTotalPrice(product.getPrice().multiply(new BigDecimal(itemDto.getQuantity())));
            
            stock.setCurrentStock(stock.getCurrentStock() - itemDto.getQuantity());
            stockRepo.save(stock);
            
            items.add(item);
            totalAmount = totalAmount.add(item.getTotalPrice());
        }

        sale.setTotalAmount(totalAmount);
        
        BigDecimal gstAmount = totalAmount.multiply(sale.getGstPercentage())
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        sale.setGstAmount(gstAmount);
        
        BigDecimal finalAmount = totalAmount.add(gstAmount);
        sale.setFinalAmount(finalAmount);
        
        sale.setItems(items);
        
        OfflineSale savedSale = offlineSaleRepo.save(sale);
        
        invoiceService.generateOfflineInvoice(savedSale.getId());
        
        return savedSale;
    }

    @Override
    public OfflineSale getSaleById(Long id) {
        return offlineSaleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Offline sale not found"));
    }

    @Override
    public List<OfflineSale> getAllSales() {
        return offlineSaleRepo.findAll();
    }

    @Override
    public List<OfflineSale> getSalesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return offlineSaleRepo.findBySaleDateBetween(startDate, endDate);
    }

    @Override
    public OfflineSaleDto convertToDto(OfflineSale sale) {
        return modelMapper.map(sale, OfflineSaleDto.class);
    }
}
