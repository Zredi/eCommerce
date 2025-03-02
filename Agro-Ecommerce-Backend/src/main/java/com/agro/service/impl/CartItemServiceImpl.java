package com.agro.service.impl;

import org.springframework.stereotype.Service;

import com.agro.model.Cart;
import com.agro.model.CartItem;
import com.agro.model.Product;
import com.agro.repository.CartItemRepo;
import com.agro.repository.CartRepo;
import com.agro.service.CartItemService;
import com.agro.service.CartService;
import com.agro.service.ProductService;

import lombok.RequiredArgsConstructor;
import java.math.*;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepo cartItemRepo;
    private final CartRepo cartRepo;
    private final ProductService productService;
    private final CartService cartService;

    /**
     * Add a product to a cart.
     * If the product is not already in the cart, a new cart item is created and added to the cart.
     * Otherwise, the quantity of the existing cart item is increased by the given quantity.
     * The total price of the cart item is then calculated and set on the cart item object.
     * The cart item is then saved to the database.
     * The cart is then updated and saved to the database.
     */
    @Override
    public void addItemToCart(Long cartId, Long productId, int quantity) {
        Cart cart = cartService.getCart(cartId);
        Product product = productService.getProductById(productId);
        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(new CartItem());
        if (cartItem.getId() == null) {
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUnitPrice(product.getPrice());
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }
        cartItem.setTotalPrice();
        cart.addItem(cartItem);
        cartItemRepo.save(cartItem);
        cartRepo.save(cart);
    }

    /**
     * Removes a product from a cart.
     * Retrieves the cart by its ID and finds the cart item to be removed by its product ID.
     * Removes the cart item from the cart and saves the cart to the database.
     */
    @Override
    public void removeItemFromCart(Long cartId, Long productId) {
        Cart cart = cartService.getCart(cartId);
        CartItem itemToRemove = getCartItem(cartId, productId);
        cart.removeItem(itemToRemove);
        cartRepo.save(cart);
    }

    /**
     * Updates the quantity of a product in a cart.
     * Retrieves the cart by its ID and finds the cart item to be updated by its product ID.
     * Updates the quantity of the cart item and recalculates the total price.
     * The total price of the cart is also updated by summing the total prices of all cart items.
     * The cart is then saved to the database.
     */
    @Override
    public void updateItemQuantity(Long cartId, Long productId, int quantity) {
        Cart cart = cartService.getCart(cartId);
        cart.getItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(quantity);
                    item.setUnitPrice(item.getProduct().getPrice());
                    item.setTotalPrice();
                });
        BigDecimal totalAmount = cart.getItems()
                .stream().map(CartItem ::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalAmount(totalAmount);
        cartRepo.save(cart);
    }

    /**
     * Retrieves a cart item by its cart ID and product ID.
     * If no cart item is found, a RuntimeException is thrown with the message "Cart item not found!".
     * @return the retrieved cart item
     */
    @Override
    public CartItem getCartItem(Long cartId, Long productId) {
        Cart cart = cartService.getCart(cartId);
        return cart.getItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found!"));
    }

}
