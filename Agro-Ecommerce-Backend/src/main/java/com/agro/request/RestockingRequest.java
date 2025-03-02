package com.agro.request;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class RestockingRequest {

	private Long productId;
	private Integer quantityAdded;
	private String source;
	private String reason;
	private BigDecimal unitPrice;
	private BigDecimal totalPrice;
}
