package com.agro.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.agro.dto.ImageDto;
import com.agro.dto.ProductDto;
import com.agro.dto.ReviewDto;
import com.agro.model.Category;
import com.agro.model.Image;
import com.agro.model.Product;
import com.agro.model.Review;
import com.agro.model.Stock;
import com.agro.model.SubCategory;
import com.agro.model.User;
import com.agro.repository.CategoryRepo;
import com.agro.repository.ImageRepo;
import com.agro.repository.ProductRepo;
import com.agro.repository.ReviewRepo;
import com.agro.repository.StockRepo;
import com.agro.repository.SubCategoryRepo;
import com.agro.repository.UserRepo;
import com.agro.request.AddProductRequest;
import com.agro.request.UpdateProductRequest;
import com.agro.service.ProductService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final SubCategoryRepo subCategoryRepo;
    private final ModelMapper modelMapper;
    private final ImageRepo imageRepo;
    private final StockRepo stockRepo;
    private final UserRepo userRepo;
    private final ReviewRepo reviewRepo;

    /**
     * Adds a new product to the database. If a product with the same name and brand
     * already exists, a RuntimeException is thrown.
     * 
     * @return the created product
     */
    @Override
    public Product addProduct(AddProductRequest request) {
        if (productExists(request.getName(), request.getBrand())) {
            throw new RuntimeException("Product already exists");
        }
        Category category = categoryRepo.findByName(request.getCategory().getName());
        category = category != null ? category : categoryRepo.save(new Category(request.getCategory().getName()));
        request.setCategory(category);
        
        SubCategory subCategory = subCategoryRepo.findByName(request.getSubCategory().getName());
        subCategory = subCategory != null ? subCategory : subCategoryRepo.save(new SubCategory(request.getSubCategory().getName(), category));
        request.setSubCategory(subCategory);
        return productRepo.save(createProduct(request, category, subCategory));
    }

    /**
     * Retrieves a product by its id. If no product is found with the given id, a
     * RuntimeException is thrown.
     * 
     * @return the product
     */
    @Override
    public Product getProductById(Long id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found!"));
    }

    /**
     * Deletes a product by its id. If no product is found with the given id, a
     * RuntimeException is thrown.
     */
    @Override
    public void deleteProductById(Long id) {
        Product product = productRepo.findById(id).orElseThrow(() -> new RuntimeException("Product not found!"));
        Stock stock = stockRepo.findByProductId(id).orElseThrow(()-> new RuntimeException("Stock not found!"));
        stockRepo.delete(stock);
        productRepo.delete(product);
    }

    /**
     * Updates an existing product with the given id. If a product with the given id
     * does not exist, a RuntimeException is thrown.
     * 
     * @return the updated product
     */
    @Override
    public Product updateProduct(UpdateProductRequest request, Long productId) {
        Product existingproduct = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found!"));

        existingproduct.setName(request.getName());
        existingproduct.setBrand(request.getBrand());
        existingproduct.setPrice(request.getPrice());
        existingproduct.setDescription(request.getDescription());
        existingproduct.setIsPopular(request.getIsPopular());

        Category category = categoryRepo.findByName(request.getCategory().getName());
        category = category != null ? category : categoryRepo.save(new Category(request.getCategory().getName()));
        existingproduct.setCategory(category);
        
        SubCategory subCategory = subCategoryRepo.findByName(request.getSubCategory().getName());
        subCategory = subCategory != null ? subCategory : subCategoryRepo.save(new SubCategory(request.getSubCategory().getName(), category));
        existingproduct.setSubCategory(subCategory);

        return productRepo.save(existingproduct);
    }

    /**
     * Retrieves all products from the database.
     * 
     * @return the list of all products
     */
    @Override
    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    /**
     * Retrieves all products from the database that belong to the given category.
     * 
     * @return the list of products in the given category
     */
    @Override
    public List<Product> getProductsByCategory(String categoryName) {
        return productRepo.findByCategoryName(categoryName);
    }
    
    @Override
    public List<Product> getProductsBySubCategory(String subCategoryName) {
    	return productRepo.findBySubCategoryName(subCategoryName);
    }

    /**
     * Retrieves all products from the database that belong to the given brand.
     * 
     * @return the list of products in the given brand
     */
    @Override
    public List<Product> getProductsByBrand(String brand) {
        return productRepo.findByBrand(brand);
    }

    /**
     * Retrieves all products from the database that belong to the given
     * category and brand.
     * 
     * @return the list of products in the given category and brand
     */
//    @Override
//    public List<Product> getProductsByCategoryAndBrand(String category, String brand) {
//        return productRepo.findByCategoryNameAndBrand(category, brand);
//    }

    /**
     * Retrieves all products from the database that have the given name.
     * 
     * @return the list of products with the given name
     */
    @Override
    public List<Product> getProductsByName(String name) {
        return productRepo.findByName(name);
    }

    /**
     * Retrieves all products from the database that belong to the given
     * brand and name.
     * 
     * @return the list of products with the given brand and name
     */
//    @Override
//    public List<Product> getProductsByBrandAndName(String brand, String name) {
//        return productRepo.findByBrandAndName(brand, name);
//    }

    /**
     * Retrieves the number of products in the database that belong to the given
     * brand and name.
     * 
     * @return the count of products with the given brand and name
     */
    @Override
    public Long countProductsByBrandAndName(String brand, String name) {
        return productRepo.countByBrandAndName(brand, name);
    }

    /**
     * Converts a given product to roductDto.
     * @return the converted productDto
     */
    @Override
    public ProductDto convertToDto(Product product) {
        ProductDto productDto = modelMapper.map(product, ProductDto.class);
        List<Image> images = imageRepo.findByProductId(product.getId());
        List<ImageDto> imageDtos = images.stream()
                .map(image -> modelMapper.map(image, ImageDto.class))
                .toList();

        productDto.setImages(imageDtos);
        
        List<Review> reviews = product.getReviews();
        if (reviews != null && !reviews.isEmpty()) {
            List<ReviewDto> reviewDtos = reviews.stream()
                    .map(review -> modelMapper.map(review, ReviewDto.class))
                    .toList();
            productDto.setReviews(reviewDtos);
        }
        return productDto;
    }

    /**
     * Converts a given list of products to a list of ProductDto objects.
     * @return the list of converted ProductDto objects
     */
    @Override
    public List<ProductDto> getConvertedProducts(List<Product> products) {
        return products.stream()
                .map(product -> convertToDto(product))
                .toList();
    }

    /**
     * Returns true if a product with the given name and brand already exists in the
     * database else false.
     */
    private boolean productExists(String name, String brand) {
        return productRepo.existsByNameAndBrand(name, brand);
    }

    /**
     * Creates a new product from the given request and category.
     * 
     * @return the created product
     */
    private Product createProduct(AddProductRequest request, Category category, SubCategory subCategory) {
        return new Product(
                request.getName(),
                request.getBrand(),
                request.getPrice(),
                request.getDescription(),
                category,
                subCategory,
                request.getIsPopular());
    }

    @Override
	public List<Product> getProductByPopular() {
		return productRepo.findByIsPopular("true");
	}

    @Override
    @Transactional
    public ProductDto addReview(Long productId, ReviewDto reviewDto) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found!"));

        if (reviewDto.getUserId() == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }

        User user = userRepo.findById(reviewDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + reviewDto.getUserId()));

        Review review = new Review();
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        review.setProduct(product);
        review.setUser(user);
        
        Review savedReview = reviewRepo.save(review);

        if (product.getReviews() == null) {
            product.setReviews(new ArrayList<>());
        }
        product.getReviews().add(savedReview);

        product.updateAverageRating();

        Product updatedProduct = productRepo.save(product);
        return convertToDto(updatedProduct);
    }

	@Override
	public List<ReviewDto> getProductReviews(Long productId) {
		Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found!"));
        return product.getReviews().stream()
                .map(review -> modelMapper.map(review, ReviewDto.class))
                .collect(Collectors.toList());
	}

	@Override
	public List<ProductDto> getProductsByRatingRange(Double minRating, Double maxRating) {
		List<Product> products = productRepo.findByAverageRatingBetween(minRating, maxRating);
        return getConvertedProducts(products);
	}


}
