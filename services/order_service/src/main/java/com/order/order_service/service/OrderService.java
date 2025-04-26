package com.order.order_service.service;

import com.order.order_service.dto.CreateOrderRequest;
import com.order.order_service.dto.OrderDTO;
import com.order.order_service.dto.UpdateOrderStatusRequest;
import com.order.order_service.model.OrderStatus;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(CreateOrderRequest createOrderRequest, Long userId);
    
    OrderDTO getOrderById(Long orderId);
    
    List<OrderDTO> getOrdersByUserId(Long userId);
    
    List<OrderDTO> getOrdersByRestaurantId(Long restaurantId);
    
    OrderDTO updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);
    
    OrderDTO assignDeliveryPersonnel(Long orderId, Long deliveryPersonnelId);
    
    List<OrderDTO> getOrdersByStatus(OrderStatus status);
    
    List<OrderDTO> getOrdersByDeliveryPersonnelId(Long deliveryPersonnelId);
    
    void updatePaymentInfo(Long orderId, String paymentId, boolean isPaid);
    
    OrderDTO cancelOrder(Long orderId);
}