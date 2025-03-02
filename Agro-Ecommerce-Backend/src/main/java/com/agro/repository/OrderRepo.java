package com.agro.repository;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.Order;

public interface OrderRepo extends JpaRepository<Order, Long>{

    List<Order> findByUserId(Long userId);
    
}
