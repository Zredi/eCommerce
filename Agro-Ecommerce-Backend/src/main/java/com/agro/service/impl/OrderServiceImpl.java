package com.agro.service.impl;

import java.util.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.stream.*;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agro.dto.OrderDto;
import com.agro.model.Address;
import com.agro.model.Cart;
import com.agro.model.Order;
import com.agro.model.OrderItem;
import com.agro.model.Product;
import com.agro.model.Stock;
import com.agro.model.enums.OrderStatus;
import com.agro.repository.AddressRepo;
import com.agro.repository.OrderRepo;
import com.agro.repository.ProductRepo;
import com.agro.repository.StockRepo;
import com.agro.service.AdminService;
import com.agro.service.CartService;
import com.agro.service.InvoiceService;
import com.agro.service.NotificationService;
import com.agro.service.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final CartService cartService;
    private final AddressRepo addressRepo;
    private final StockRepo stockRepo;
    private final InvoiceService invoiceService;
    private final NotificationService notificationService;
    private final AdminService adminService;
    private final ModelMapper modelMapper;
    
    
    @Override
	public List<Order> getAllOrders() {
		return orderRepo.findAll();
	}

    /**
     * Places an order for the given user ID, using the contents of that user's cart.
     * The order is created with the given user, set to PENDING status, and with the current date.
     * The items in the cart are converted to order items, the total amount is calculated, and the order is saved.
     * The cart is then cleared.
     * @return the saved order
     */
    @Transactional
    @Override
    public Order placeOrder(Long userId, Long addressId) {
        Cart cart = cartService.getCartByUserId(userId);
        Order order = createOrder(cart);
        Address selectedAddress = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        order.setAddress(selectedAddress);
        List<OrderItem> orderItemList = createOrderItems(order, cart);
        order.setOrderItems(new HashSet<>(orderItemList));
        order.setTotalAmount(calculateTotalAmount(orderItemList));
        Order savedOrder = orderRepo.save(order);
        cartService.clearCart(cart.getId());
        invoiceService.generateInvoice(savedOrder.getOrderId());
        
        notifyAdminsAboutNewOrder(savedOrder, userId);
        
        notificationService.sendNotification(
        		userId,
        		String.format("Your order has been placed successfully! Order ID: %d, Total Amount: %s",
                        savedOrder.getOrderId(),
                        savedOrder.getTotalAmount())
        		);
        return savedOrder;
    }
    
    private void notifyAdminsAboutNewOrder(Order order, Long userId) {
        String adminMessage = String.format(
            "New order placed - Order ID: %d, Customer ID: %d, Total Amount: %s",
            order.getOrderId(),
            userId,
            order.getTotalAmount()
        );
        
        List<Long> adminIds = adminService.getAdminUserIds();
        
        if (adminIds.isEmpty()) {
            log.warn("No admin users found in the system for order notification");
            return;
        }
        
        for (Long adminId : adminIds) {
            try {
                notificationService.sendNotification(adminId, adminMessage);
            } catch (Exception e) {
                log.error("Failed to send notification to admin ID: " + adminId, e);
            }
        }
    }

    /**
     * Creates an order object from the given cart.
     * The order is given the same user as the cart, and is set to PENDING status.
     * The order date is set to the current date.
     * @return the created order
     */
    private Order createOrder(Cart cart) {
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDate.now());
        return order;
    }

    /**
     * Creates a list of order items from the given cart.
     * Each cart item is converted to an order item, and the product stock is decremented by the item quantity.
     * The product is then saved to the database.
     * @return the list of order items
     */
    private List<OrderItem> createOrderItems(Order order, Cart cart) {
        return cart.getItems().stream().map(cartItem -> {
            Product product = cartItem.getProduct();
//            product.setStock(product.getStock() - cartItem.getQuantity());
            Stock stock = stockRepo.findByProductId(product.getId())
            		.orElseThrow(()-> new RuntimeException("Stock not found!"));
            
            int currentStock = stock.getCurrentStock();
            int orderQuantity = cartItem.getQuantity();
            if (currentStock < orderQuantity) {
                throw new IllegalStateException("Insufficient stock for product: " + product.getName());
            }
            
            stock.setCurrentStock(currentStock - orderQuantity);
            stockRepo.save(stock);
//            productRepo.save(product);
            return new OrderItem(
                    order,
                    product,
                    cartItem.getQuantity(),
                    cartItem.getUnitPrice());
        }).toList();
    }

    /**
     * Calculates the total amount of the order from the given list of order items.
     * For each order item, the price is multiplied by the quantity and added to the total amount.
     * @return the total amount of the order
     */
    private BigDecimal calculateTotalAmount(List<OrderItem> orderItemList) {
        BigDecimal totalPrice = BigDecimal.ZERO;
        for(OrderItem item : orderItemList){
            BigDecimal itemPrice = item.getPrice().multiply(new BigDecimal(item.getQuantity()));
            totalPrice = totalPrice.add(itemPrice);
        }
        return totalPrice;
    }

    /**
     * Retrieves an order by its ID and maps it to an OrderDto.
     * If no order is found, a RuntimeException is thrown with the message "Order not found!".
     * @return the retrieved order as an OrderDto
     */
    @Override
    public OrderDto getOrder(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found!"));
        return modelMapper.map(order, OrderDto.class);
    }
    
    @Transactional
    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        validateStatusTransition(order.getOrderStatus(), status);
        
        OrderStatus oldStatus = order.getOrderStatus();
        order.setOrderStatus(status);
        Order updatedOrder = orderRepo.save(order);
        
        notificationService.sendNotification(
                order.getUser().getId(),
                String.format("Your order (ID: %d) status has been updated from %s to %s",
                    orderId,
                    oldStatus,
                    status)
            );
        
        return updatedOrder;
    }
    
    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot update status of cancelled order");
        }
        
        if (currentStatus == OrderStatus.DELIVERED && newStatus != OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot change status of delivered order");
        }
        
    }

    /**
     * Retrieves a list of orders for the given user ID and maps them to a list of OrderDto objects.
     * @return the list of retrieved orders as a list of OrderDto objects
     */
    @Override
    public List<OrderDto> getUserOrders(Long userId) {
        List<Order> orders = orderRepo.findByUserId(userId);
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderDto.class))
                .collect(Collectors.toList());

    }

    /**
     * Converts a given order to its corresponding data transfer object.
     * @return the converted order data transfer object
     */
    @Override
    public OrderDto convertToDto(Order order) {
        return modelMapper.map(order, OrderDto.class);
    }

	

}
