package com.agro.service;

import java.util.*;

import com.agro.dto.OrderDto;
import com.agro.model.Order;
import com.agro.model.enums.OrderStatus;

public interface OrderService {
	
	List<Order> getAllOrders();

    Order placeOrder(Long userId, Long addressId);

    OrderDto getOrder(Long orderId);

    List<OrderDto> getUserOrders(Long userId);
    
    Order updateOrderStatus(Long orderId, OrderStatus status);

    OrderDto convertToDto(Order order);
}
