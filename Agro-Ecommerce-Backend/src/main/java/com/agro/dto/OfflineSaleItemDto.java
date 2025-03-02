package com.agro.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class OfflineSaleItemDto {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
}