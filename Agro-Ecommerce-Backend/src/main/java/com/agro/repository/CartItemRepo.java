package com.agro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.CartItem;

public interface CartItemRepo extends JpaRepository<CartItem, Long>{

    void deleteAllByCartId(Long id);
    
}
