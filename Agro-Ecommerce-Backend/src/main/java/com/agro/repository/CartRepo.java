package com.agro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.Cart;

public interface CartRepo extends JpaRepository<Cart, Long>{

    Cart findByUserId(Long userId);
    
}
