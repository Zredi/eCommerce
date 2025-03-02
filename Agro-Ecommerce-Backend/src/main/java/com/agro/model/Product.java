package com.agro.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
    private String description;
    private String isPopular;
    private Double averageRating;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable=false)
    private Category category;
    
    @ManyToOne 
    @JoinColumn(name = "subcategory_id",nullable=false) 
    private SubCategory subCategory;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    public Product(String name, String brand, BigDecimal price, String description, Category category, SubCategory subCategory, String isPopular) {
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.description = description;
        this.category = category;
        this.subCategory = subCategory;
        this.isPopular = isPopular;
        this.averageRating = 0.0;
        this.reviews = new ArrayList<>();
    }
    
    public void updateAverageRating() {
        if (reviews != null && !reviews.isEmpty()) {
            double sum = reviews.stream()
                .mapToDouble(Review::getRating)
                .sum();
            this.averageRating = sum / reviews.size();
        } else {
            this.averageRating = 0.0;
        }
    }
}