package com.agro.request;

import java.math.BigDecimal;

import com.agro.model.Category;
import com.agro.model.SubCategory;

import lombok.Data;

@Data
public class AddProductRequest {
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
    private String description;
    private String isPopular;
    private Category category;
    private SubCategory subCategory;
}
