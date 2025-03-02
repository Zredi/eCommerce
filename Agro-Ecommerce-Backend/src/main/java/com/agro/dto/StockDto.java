package com.agro.dto;

import lombok.Data;

@Data
public class StockDto {

	private Long id;
	private ProductDto product;
	private Integer currentStock;
}
