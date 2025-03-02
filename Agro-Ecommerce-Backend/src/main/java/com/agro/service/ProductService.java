package com.agro.service;

import com.agro.dto.ProductDto;
import com.agro.dto.ReviewDto;
import com.agro.model.Product;
import com.agro.request.AddProductRequest;
import com.agro.request.UpdateProductRequest;

import java.util.*;

public interface ProductService {

    Product addProduct(AddProductRequest request);

    Product getProductById(Long id);

    void deleteProductById(Long id);

    Product updateProduct(UpdateProductRequest request, Long productId);

    List<Product> getAllProducts();

    List<Product> getProductsByCategory(String category);
    
    List<Product> getProductsBySubCategory(String subCategory);

    List<Product> getProductsByBrand(String brand);

//    List<Product> getProductsByCategoryAndBrand(String category, String brand);

    List<Product> getProductsByName(String name);

//    List<Product> getProductsByBrandAndName(String category, String name);
    
    List<Product> getProductByPopular();

    Long countProductsByBrandAndName(String brand, String name);

    List<ProductDto> getConvertedProducts(List<Product> products);

    ProductDto convertToDto(Product product);
    
    
    ProductDto addReview(Long productId, ReviewDto reviewDto);
    List<ReviewDto> getProductReviews(Long productId);
    List<ProductDto> getProductsByRatingRange(Double minRating, Double maxRating);
}
