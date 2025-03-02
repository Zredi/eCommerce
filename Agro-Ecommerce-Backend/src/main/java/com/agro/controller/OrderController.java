package com.agro.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.agro.dto.OrderDto;
import com.agro.model.Order;
import com.agro.model.enums.OrderStatus;
import com.agro.response.ApiResponse;
import com.agro.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/orders")
public class OrderController {

    private final OrderService orderService;
    
    
    @GetMapping
    public ResponseEntity<ApiResponse> getAllOrders(){
    	List<Order> orders = orderService.getAllOrders();
    	List<OrderDto> convertedOrders = orders.stream()
                .map(orderService::convertToDto)
                .toList();
    	return  ResponseEntity.ok(new ApiResponse("success", convertedOrders));
    }

    /**
     * Creates a new order for the given user ID, using the contents of the user's cart.
     * The order is created with the given user, set to PENDING status, and with the current date.
     * The items in the cart are converted to order items, the total amount is calculated, and the order is saved.
     * The cart is then cleared.
     * @return the created order as an OrderDto
     */
    @PostMapping("/order")
    public ResponseEntity<ApiResponse> createOrder(@RequestParam Long userId, @RequestParam Long addressId) {
        try {
            Order order =  orderService.placeOrder(userId, addressId);
            OrderDto orderDto =  orderService.convertToDto(order);
            return ResponseEntity.ok(new ApiResponse("Item Order Success!", orderDto));
        } catch (Exception e) {
        	System.out.println(e);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("Error Occured!", e.getMessage()));
        }
    }

    /**
     * Retrieves an order by its ID and maps it to an OrderDto.
     * If no order is found, a 404 error is returned.
     * @return a ResponseEntity containing the retrieved order as an OrderDto
     */
    @GetMapping("/{orderId}/order")
    public ResponseEntity<ApiResponse> getOrderById(@PathVariable Long orderId) {
        try {
            OrderDto order = orderService.getOrder(orderId);
            return ResponseEntity.ok(new ApiResponse("Item Order Success!", order));
        } catch (Exception e) {
           return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Oops!", e.getMessage()));
        }
    }

    /**
     * Retrieves a list of orders for the given user ID and maps them to a list of OrderDto objects.
     * If no orders are found, a 404 error is returned.
     * @return a ResponseEntity containing the list of retrieved orders as a list of OrderDto objects
     */
    @GetMapping("/user/{userId}/order")
    public ResponseEntity<ApiResponse> getUserOrders(@PathVariable Long userId) {
        try {
            List<OrderDto> order = orderService.getUserOrders(userId);
            return ResponseEntity.ok(new ApiResponse("Item Order Success!", order));
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Oops!", e.getMessage()));
        }
    }
    
    @PostMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(orderId, status);
            OrderDto orderDto = orderService.convertToDto(updatedOrder);
            return ResponseEntity.ok(new ApiResponse("Order status updated successfully!", orderDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse("Failed to update order status", e.getMessage()));
        }
    }

}
