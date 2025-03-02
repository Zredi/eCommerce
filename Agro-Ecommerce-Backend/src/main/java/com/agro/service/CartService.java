package com.agro.service;

import java.math.BigDecimal;

import com.agro.dto.CartDto;
import com.agro.model.Cart;
import com.agro.model.User;

public interface CartService {

    Cart getCart(Long id);

    void clearCart(Long id);

    BigDecimal getTotalPrice(Long id);

    Cart initializeNewCart(User user);

    Cart getCartByUserId(Long userId);

    CartDto convertToDto(Cart cart);
    
}
