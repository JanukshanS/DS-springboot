package com.order.order_service.service.impl;

import com.order.order_service.dto.*;
import com.order.order_service.exception.ResourceNotFoundException;
import com.order.order_service.model.Order;
import com.order.order_service.model.OrderItem;
import com.order.order_service.model.OrderStatus;
import com.order.order_service.repository.OrderRepository;
import com.order.order_service.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public OrderDTO createOrder(CreateOrderRequest createOrderRequest, Long userId) {
        Order order = new Order();
        order.setUserId(userId);
        order.setRestaurantId(createOrderRequest.getRestaurantId());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderTime(LocalDateTime.now());
        order.setDeliveryAddress(createOrderRequest.getDeliveryAddress());
        order.setSpecialInstructions(createOrderRequest.getSpecialInstructions());
        order.setPaymentMethod(createOrderRequest.getPaymentMethod());
        order.setIsPaid(false);
        
        // Create order items
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (OrderItemRequest itemRequest : createOrderRequest.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItemId(itemRequest.getMenuItemId());
            // In a real-world scenario, you would fetch the menu item details from the restaurant service
            // For now, we'll set the price to a placeholder value
            orderItem.setPrice(BigDecimal.valueOf(10.0)); // Placeholder price
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setCustomizations(itemRequest.getCustomizations());
            orderItem.setOrder(order);
            orderItems.add(orderItem);
            
            // Calculate total amount
            totalAmount = totalAmount.add(orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
        }
        
        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        
        Order savedOrder = orderRepository.save(order);
        return mapToDTO(savedOrder);
    }

    @Override
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return mapToDTO(order);
    }

    @Override
    public List<OrderDTO> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersByRestaurantId(Long restaurantId) {
        List<Order> orders = orderRepository.findByRestaurantId(restaurantId);
        return orders.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        // Validate status transitions based on business rules
        validateStatusTransition(order.getStatus(), request.getStatus());
        
        order.setStatus(request.getStatus());
        
        // Additional logic for status updates
        if (request.getStatus() == OrderStatus.DELIVERED) {
            order.setDeliveryTime(LocalDateTime.now());
        }
        
        Order updatedOrder = orderRepository.save(order);
        return mapToDTO(updatedOrder);
    }

    @Override
    @Transactional
    public OrderDTO assignDeliveryPersonnel(Long orderId, Long deliveryPersonnelId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        order.setDeliveryPersonnelId(deliveryPersonnelId);
        
        // If status is READY_FOR_PICKUP, update to OUT_FOR_DELIVERY
        if (order.getStatus() == OrderStatus.READY_FOR_PICKUP) {
            order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        }
        
        Order updatedOrder = orderRepository.save(order);
        return mapToDTO(updatedOrder);
    }

    @Override
    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        List<Order> orders = orderRepository.findByStatus(status);
        return orders.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersByDeliveryPersonnelId(Long deliveryPersonnelId) {
        List<Order> orders = orderRepository.findByDeliveryPersonnelId(deliveryPersonnelId);
        return orders.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updatePaymentInfo(Long orderId, String paymentId, boolean isPaid) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        order.setPaymentId(paymentId);
        order.setIsPaid(isPaid);
        
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public OrderDTO cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        // Check if order can be cancelled
        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Cannot cancel a delivered order");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        
        return mapToDTO(updatedOrder);
    }
    
    // Helper methods
    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        // Implement your business rules for status transitions
        // For example, an order can't go from CANCELLED to PREPARING
        
        if (currentStatus == OrderStatus.CANCELLED && newStatus != OrderStatus.CANCELLED) {
            throw new IllegalStateException("Cannot change status of a cancelled order");
        }
        
        if (currentStatus == OrderStatus.DELIVERED && newStatus != OrderStatus.DELIVERED) {
            throw new IllegalStateException("Cannot change status of a delivered order");
        }
        
        // Add more rules as needed
    }
    
    private OrderDTO mapToDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setUserId(order.getUserId());
        orderDTO.setRestaurantId(order.getRestaurantId());
        orderDTO.setStatus(order.getStatus());
        orderDTO.setOrderTime(order.getOrderTime());
        orderDTO.setDeliveryTime(order.getDeliveryTime());
        orderDTO.setTotalAmount(order.getTotalAmount());
        orderDTO.setDeliveryAddress(order.getDeliveryAddress());
        orderDTO.setSpecialInstructions(order.getSpecialInstructions());
        orderDTO.setDeliveryPersonnelId(order.getDeliveryPersonnelId());
        orderDTO.setIsPaid(order.getIsPaid());
        orderDTO.setPaymentId(order.getPaymentId());
        orderDTO.setPaymentMethod(order.getPaymentMethod());
        
        // Map order items
        if (order.getOrderItems() != null) {
            List<OrderItemDTO> orderItemDTOs = order.getOrderItems().stream()
                    .map(this::mapToItemDTO)
                    .collect(Collectors.toList());
            orderDTO.setOrderItems(orderItemDTOs);
        }
        
        return orderDTO;
    }
    
    private OrderItemDTO mapToItemDTO(OrderItem orderItem) {
        OrderItemDTO orderItemDTO = new OrderItemDTO();
        orderItemDTO.setId(orderItem.getId());
        orderItemDTO.setMenuItemId(orderItem.getMenuItemId());
        orderItemDTO.setMenuItemName(orderItem.getMenuItemName());
        orderItemDTO.setQuantity(orderItem.getQuantity());
        orderItemDTO.setPrice(orderItem.getPrice());
        orderItemDTO.setCustomizations(orderItem.getCustomizations());
        return orderItemDTO;
    }
}