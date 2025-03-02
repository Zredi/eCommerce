package com.agro.dto;

import lombok.Data;

@Data
public class ReviewDto {

	private Long id;
    private Integer rating;
    private String comment;
    private Long productId;
    private Long userId;
}
