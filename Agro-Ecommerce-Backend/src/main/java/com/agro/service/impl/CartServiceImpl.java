package com.agro.service.impl;

import java.math.BigDecimal;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agro.dto.CartDto;
import com.agro.model.Cart;
import com.agro.model.User;
import com.agro.repository.CartItemRepo;
import com.agro.repository.CartRepo;
import com.agro.service.CartService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService{

    private final CartRepo cartRepo;
    private final CartItemRepo cartItemRepo;
    private final ModelMapper modelMapper;
    
    /**
     * Retrieves a cart by its ID.
     * If no cart is found, a RuntimeException is thrown with the message "Cart not found!".
     * The total amount of the cart is then calculated and set on the cart object.
     * @return the retrieved cart
     */
    @Override
    public Cart getCart(Long id) {
        Cart cart = cartRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Cart not found!"));

        BigDecimal totalAmount = cart.getTotalAmount();
        cart.setTotalAmount(totalAmount);
        return cartRepo.save(cart);
    }

    /**
     * Clears a cart by its ID.
     * Retrieves the cart by its ID using the `getCart` method.
     * Deletes all cart items associated with the cart using the `deleteAllByCartId` method of the `cartItemRepo`.
     * Calls the `clearCart` method of the cart to clear its items.
     * Then, deletes the cart using the `deleteById` method of the `cartRepo`.
     */
    @Transactional
    @Override
    public void clearCart(Long id) {
        Cart cart = getCart(id);
        cartItemRepo.deleteAllByCartId(id);
        cart.clearCart();
        cartRepo.deleteById(id);
    }

    /**
     * Retrieves the total amount of a cart by its ID.
     * @return the total amount of the cart
     */
    @Override
    public BigDecimal getTotalPrice(Long id) {
        Cart cart = getCart(id);
        return cart.getTotalAmount();
    }

    /**
     * Initializes a new cart for the given user.
     * If a cart does not already exist for the user, a new cart is created and saved to the database.
     * Otherwise, the existing cart is retrieved.
     * @return the initialized cart
     */
    @Override
    public Cart initializeNewCart(User user) {
        Cart cart = getCartByUserId(user.getId());
        if(cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepo.save(cart);
        }
        return cart;
    }


    /**
     * Retrieves a cart by its user ID.
     * If no cart is found, null is returned.
     * @return the retrieved cart, or null if no cart is found
     */
    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepo.findByUserId(userId);
    }

    @Override
    public CartDto convertToDto(Cart cart){
        return modelMapper.map(cart, CartDto.class);
    }

}
