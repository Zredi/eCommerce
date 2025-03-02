package com.agro.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

import com.agro.model.Category;
import com.agro.model.SubCategory;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
    private String description;
    private String isPopular;
    private Category category;
    private SubCategory subCategory;
    private List<ImageDto> images;
    private Double averageRating;
    private List<ReviewDto> reviews;
}
