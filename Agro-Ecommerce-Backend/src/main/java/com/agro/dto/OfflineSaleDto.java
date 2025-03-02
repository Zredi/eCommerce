package com.agro.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

import lombok.Data;

@Data
public class OfflineSaleDto {
    private Long id;
    private LocalDateTime saleDate;
    private BigDecimal totalAmount;
    private String customerName;
    private String customerPhone;
    private String paymentMethod;
    private BigDecimal gstPercentage;
    private BigDecimal gstAmount;
    private BigDecimal finalAmount;
    private Set<OfflineSaleItemDto> items;
}
