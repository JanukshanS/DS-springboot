package com.order.order_service.service.impl;

import com.order.order_service.dto.CreateOrderRequest;
import com.order.order_service.dto.OrderDTO;
import com.order.order_service.dto.OrderItemRequest;
import com.order.order_service.dto.UpdateOrderStatusRequest;
import com.order.order_service.exception.ResourceNotFoundException;
import com.order.order_service.model.Order;
import com.order.order_service.model.OrderItem;
import com.order.order_service.model.OrderStatus;
import com.order.order_service.model.PaymentMethod;
import com.order.order_service.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order testOrder;
    private OrderItem testOrderItem;
    private CreateOrderRequest createOrderRequest;
    private UpdateOrderStatusRequest updateStatusRequest;
    private Long userId = 1L;
    private Long orderId = 1L;
    private Long restaurantId = 2L;

    @BeforeEach
    void setUp() {
        // Setup test order item
        testOrderItem = new OrderItem();
        testOrderItem.setId(1L);
        testOrderItem.setMenuItemId(1L);
        testOrderItem.setMenuItemName("Test Item");
        testOrderItem.setQuantity(2);
        testOrderItem.setPrice(BigDecimal.valueOf(10.0));

        // Setup test order
        testOrder = new Order();
        testOrder.setId(orderId);
        testOrder.setUserId(userId);
        testOrder.setRestaurantId(restaurantId);
        testOrder.setStatus(OrderStatus.PENDING);
        testOrder.setOrderTime(LocalDateTime.now());
        testOrder.setTotalAmount(BigDecimal.valueOf(20.0));
        testOrder.setDeliveryAddress("123 Test St");
        testOrder.setOrderItems(List.of(testOrderItem));
        testOrder.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        testOrderItem.setOrder(testOrder);

        // Setup create order request
        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setMenuItemId(1L);
        itemRequest.setQuantity(2);

        createOrderRequest = new CreateOrderRequest();
        createOrderRequest.setRestaurantId(restaurantId);
        createOrderRequest.setDeliveryAddress("123 Test St");
        createOrderRequest.setItems(List.of(itemRequest));
        createOrderRequest.setPaymentMethod(PaymentMethod.CREDIT_CARD);

        // Setup update status request
        updateStatusRequest = new UpdateOrderStatusRequest();
        updateStatusRequest.setStatus(OrderStatus.CONFIRMED);
    }

    @Test
    void createOrder_ShouldReturnOrderDTO() {
        // Arrange
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        // Act
        OrderDTO result = orderService.createOrder(createOrderRequest, userId);

        // Assert
        assertNotNull(result);
        assertEquals(orderId, result.getId());
        assertEquals(userId, result.getUserId());
        assertEquals(restaurantId, result.getRestaurantId());
        assertEquals(OrderStatus.PENDING, result.getStatus());
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void getOrderById_ShouldReturnOrderDTO_WhenOrderExists() {
        // Arrange
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));

        // Act
        OrderDTO result = orderService.getOrderById(orderId);

        // Assert
        assertNotNull(result);
        assertEquals(orderId, result.getId());
        verify(orderRepository, times(1)).findById(orderId);
    }

    @Test
    void getOrderById_ShouldThrowException_WhenOrderDoesNotExist() {
        // Arrange
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> orderService.getOrderById(orderId));
        verify(orderRepository, times(1)).findById(orderId);
    }

    @Test
    void updateOrderStatus_ShouldReturnUpdatedOrderDTO() {
        // Arrange
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        // Act
        OrderDTO result = orderService.updateOrderStatus(orderId, updateStatusRequest);

        // Assert
        assertNotNull(result);
        assertEquals(OrderStatus.CONFIRMED, result.getStatus());
        verify(orderRepository, times(1)).findById(orderId);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void cancelOrder_ShouldReturnCancelledOrderDTO() {
        // Arrange
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        // Act
        OrderDTO result = orderService.cancelOrder(orderId);

        // Assert
        assertNotNull(result);
        assertEquals(OrderStatus.CANCELLED, result.getStatus());
        verify(orderRepository, times(1)).findById(orderId);
        verify(orderRepository, times(1)).save(any(Order.class));
    }
}