package com.agro.controller;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.agro.dto.ProductDto;
import com.agro.dto.ReviewDto;
import com.agro.model.Product;
import com.agro.request.AddProductRequest;
import com.agro.request.UpdateProductRequest;
import com.agro.response.ApiResponse;
import com.agro.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/products")
public class ProductController {

    private final ProductService productService;

    /**
     * Retrieves all products from the database.
     * 
     * @return a ResponseEntity containing an ApiResponse with a list of ProductDto objects
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
        return  ResponseEntity.ok(new ApiResponse("success", convertedProducts));
    }

    /**
     * Retrieves a product by its id. If no product is found with the given id, a
     * RuntimeException is thrown.
     * 
     * @return a ResponseEntity containing an ApiResponse with a ProductDto object
     */
    @GetMapping("/product/{productId}/product")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Long productId) {
        try {
            Product product = productService.getProductById(productId);
            ProductDto productDto = productService.convertToDto(product);
            return  ResponseEntity.ok(new ApiResponse("success", productDto));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    /**
     * Adds a new product to the database. If a product with the same name and brand
     * already exists, a RuntimeException is thrown.
     * 
     * @return a ResponseEntity containing an ApiResponse with a ProductDto object
     */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addProduct(@RequestBody AddProductRequest product) {
        try {
            Product theProduct = productService.addProduct(product);
            ProductDto productDto = productService.convertToDto(theProduct);
            return ResponseEntity.ok(new ApiResponse("Add product success!", productDto));
        } catch (Exception e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
        }
    }
    /**
     * Updates an existing product with the given id. If a product with the given id
     * does not exist, a RuntimeException is thrown.
     * 
     * @return a ResponseEntity containing an ApiResponse with a ProductDto object
     */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/product/{productId}/update")
    public  ResponseEntity<ApiResponse> updateProduct(@RequestBody UpdateProductRequest request, @PathVariable Long productId) {
        try {
            Product theProduct = productService.updateProduct(request, productId);
            ProductDto productDto = productService.convertToDto(theProduct);
            return ResponseEntity.ok(new ApiResponse("Update product success!", productDto));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    /**
     * Deletes a product by its id. If no product is found with the given id, a
     * 404 error is returned.
     * @return a ResponseEntity containing a success message if the product was
     * deleted, or a 404 error if no product was found
     */
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/product/{productId}/delete")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long productId) {
        try {
            productService.deleteProductById(productId);
            return ResponseEntity.ok(new ApiResponse("Delete product success!", productId));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    /**
     * Retrieves all products from the database that belong to the given
     * brand and name.
     * @return a ResponseEntity containing an ApiResponse with a list of ProductDto objects
     * if the product was found, a 404 error if no product was found, or a 500 error
     * if an unexpected error occurred
     */
//    @GetMapping("/products/by/brand-and-name")
//    public ResponseEntity<ApiResponse> getProductByBrandAndName(@RequestParam String brandName, @RequestParam String productName) {
//        try {
//            List<Product> products = productService.getProductsByBrandAndName(brandName, productName);
//            if (products.isEmpty()) {
//                return ResponseEntity.status(NOT_FOUND).body(new ApiResponse("No products found ", null));
//            }
//            List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
//            return  ResponseEntity.ok(new ApiResponse("success", convertedProducts));
//        } catch (Exception e) {
//            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
//        }
//    }

    /**
     * Retrieves all products from the database that belong to the given
     * category and brand.
     * @return a ResponseEntity containing an ApiResponse with a list of ProductDto objects
     * if the product was found, a 404 error if no product was found, or a 500 error
     * if an unexpected error occurred
     */
//    @GetMapping("/products/by/category-and-brand")
//    public ResponseEntity<ApiResponse> getProductByCategoryAndBrand(@RequestParam String category, @RequestParam String brand){
//        try {
//            List<Product> products = productService.getProductsByCategoryAndBrand(category, brand);
//            if (products.isEmpty()) {
//                return ResponseEntity.status(NOT_FOUND).body(new ApiResponse("No products found ", null));
//            }
//            List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
//            return  ResponseEntity.ok(new ApiResponse("success", convertedProducts));
//        } catch (Exception e) {
//            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("error", e.getMessage()));
//        }
//    }

    /**
     * Retrieves all products from the database that have the given name.
     * @return a ResponseEntity containing an ApiResponse with a list of ProductDto objects
     * if the product was found, a 404 error if no product was found, or a 500 error
     * if an unexpected error occurred
     */
    @GetMapping("/products/{name}/products")
    public ResponseEntity<ApiResponse> getProductByName(@PathVariable String name){
        try {
            List<Product> products = productService.getProductsByName(name);
            if (products.isEmpty()) {
                return ResponseEntity.status(NOT_FOUND).body(new ApiResponse("No products found ", null));
            }
            List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
            return  ResponseEntity.ok(new ApiResponse("success", convertedProducts));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("error", e.getMessage()));
        }
    }

    /**
     * Retrieves all products from the database that belong to the given brand.
     * @return a ResponseEntity containing an ApiResponse with a list of ProductDto objects
     * if the product was found, a 404 error if no product was found, or a 500 error
     * if an unexpected error occurred
     */
    @GetMapping("/product/by-brand")
    public ResponseEntity<ApiResponse> findProductByBrand(@RequestParam String brand) {
        try {
            List<Product> products = productService.getProductsByBrand(brand);
            if (products.isEmpty()) {
                return ResponseEntity.status(NOT_FOUND).body(new ApiResponse("No products found ", null));
            }
            List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
            return  ResponseEntity.ok(new ApiResponse("success", convertedProducts));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(e.getMessage(), null));
        }
    }

    /**
     * Retrieves all products from the database that belong to the given
     * category.
     * @return a ResponseEntity containing an ApiResponse with a list of ProductDto objects
     * if the product was found, a 404 error if no product was found, or a 500 error
     * if an unexpected error occurred
     */
    @GetMapping("/product/{category}/all/products")
    public ResponseEntity<ApiResponse> findProductByCategory(@PathVariable String category) {
        try {
            List<Product> products = productService.getProductsByCategory(category);
            if (products.isEmpty()) {
                return ResponseEntity.status(NOT_FOUND).body(new ApiResponse("No products found ", null));
            }
            List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
            return  ResponseEntity.ok(new ApiResponse("success", convertedProducts));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(e.getMessage(), null));
        }
    }
    
    @GetMapping("/product/subcategory/{subCategory}/all/products")
    public ResponseEntity<ApiResponse> findProductBySubCategory(@PathVariable String subCategory) {
    	try {
    		List<Product> products = productService.getProductsBySubCategory(subCategory);
    		if (products.isEmpty()) {
    			return ResponseEntity.status(NOT_FOUND).body(new ApiResponse("No products found ", null));
    		}
    		List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
    		return  ResponseEntity.ok(new ApiResponse("success", convertedProducts));
    	} catch (Exception e) {
    		return ResponseEntity.ok(new ApiResponse(e.getMessage(), null));
    	}
    }

    /**
     * Retrieves the number of products in the database that belong to the given
     * brand and name.
     * @return a ResponseEntity containing an ApiResponse with the count of products
     * if the count was found, a 404 error if no product count was found, or a 500 error
     * if an unexpected error occurred
     */
    @GetMapping("/product/count/by-brand/and-name")
    public ResponseEntity<ApiResponse> countProductsByBrandAndName(@RequestParam String brand, @RequestParam String name) {
        try {
            var productCount = productService.countProductsByBrandAndName(brand, name);
            return ResponseEntity.ok(new ApiResponse("Product count!", productCount));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(e.getMessage(), null));
        }
    }
    
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse> getFeaturedProducts() {
        try {
            List<Product> featuredProducts = productService.getProductByPopular();
            List<ProductDto> convertedProducts = productService.getConvertedProducts(featuredProducts);
            return ResponseEntity.ok(new ApiResponse("success", convertedProducts));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error fetching featured products", null));
        }
    }
    
    
    
    /**
     * Adds a review to a product.
     * @return a ResponseEntity containing an ApiResponse with the updated ProductDto
     */
    @PostMapping("/product/{productId}/review")
    public ResponseEntity<ApiResponse> addReview(@PathVariable Long productId, @RequestBody ReviewDto reviewDto) {
        try {
            ProductDto updatedProduct = productService.addReview(productId, reviewDto);
            return ResponseEntity.ok(new ApiResponse("Review added successfully!", updatedProduct));
        } catch (Exception e) {
        	System.out.println(e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

    /**
     * Retrieves all reviews for a product.
     * @return a ResponseEntity containing an ApiResponse with a list of ReviewDto objects
     */
    @GetMapping("/product/{productId}/reviews")
    public ResponseEntity<ApiResponse> getProductReviews(@PathVariable Long productId) {
        try {
            List<ReviewDto> reviews = productService.getProductReviews(productId);
            if (reviews.isEmpty()) {
                return ResponseEntity.status(NOT_FOUND).body(new ApiResponse("No reviews found", null));
            }
            return ResponseEntity.ok(new ApiResponse("success", reviews));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

    /**
     * Retrieves products within a specified rating range.
     * @return a ResponseEntity containing an ApiResponse with a list of ProductDto objects
     */
    @GetMapping("/products/by-rating")
    public ResponseEntity<ApiResponse> getProductsByRatingRange(
            @RequestParam Double minRating,
            @RequestParam Double maxRating) {
        try {
            List<ProductDto> products = productService.getProductsByRatingRange(minRating, maxRating);
            if (products.isEmpty()) {
                return ResponseEntity.status(NOT_FOUND).body(new ApiResponse("No products found in rating range", null));
            }
            return ResponseEntity.ok(new ApiResponse("success", products));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

}
