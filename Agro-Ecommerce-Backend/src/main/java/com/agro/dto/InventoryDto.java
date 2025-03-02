package com.agro.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class InventoryDto {

	private Long id;
    private StockDto stock;
    private Integer quantityAdded;
    private Integer quantityAdjusted;
    private String source;
    private String reason;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private LocalDateTime timestamp;
}
