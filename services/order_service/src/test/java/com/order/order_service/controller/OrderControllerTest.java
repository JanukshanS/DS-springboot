package com.order.order_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.order.order_service.dto.CreateOrderRequest;
import com.order.order_service.dto.OrderDTO;
import com.order.order_service.dto.OrderItemRequest;
import com.order.order_service.dto.UpdateOrderStatusRequest;
import com.order.order_service.model.OrderStatus;
import com.order.order_service.model.PaymentMethod;
import com.order.order_service.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    private OrderDTO testOrderDTO;
    private CreateOrderRequest createOrderRequest;
    private UpdateOrderStatusRequest updateStatusRequest;
    private Long userId = 1L;
    private Long orderId = 1L;
    private Long restaurantId = 2L;

    @BeforeEach
    void setUp() {
        // Setup test OrderDTO
        testOrderDTO = new OrderDTO();
        testOrderDTO.setId(orderId);
        testOrderDTO.setUserId(userId);
        testOrderDTO.setRestaurantId(restaurantId);
        testOrderDTO.setStatus(OrderStatus.PENDING);
        testOrderDTO.setOrderTime(LocalDateTime.now());
        testOrderDTO.setTotalAmount(BigDecimal.valueOf(20.0));
        testOrderDTO.setDeliveryAddress("123 Test St");
        testOrderDTO.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        testOrderDTO.setOrderItems(new ArrayList<>());

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
    @WithMockUser
    void createOrder_ShouldReturnCreatedOrder() throws Exception {
        // Arrange
        when(orderService.createOrder(any(CreateOrderRequest.class), eq(userId))).thenReturn(testOrderDTO);

        // Mock the request attribute for userId
        mockMvc.perform(post("/api/orders")
                .with(request -> {
                    request.setAttribute("userId", userId);
                    return request;
                })
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createOrderRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(orderId))
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.restaurantId").value(restaurantId))
                .andExpect(jsonPath("$.status").value(OrderStatus.PENDING.toString()));
    }

    @Test
    @WithMockUser
    void getOrderById_ShouldReturnOrder() throws Exception {
        // Arrange
        when(orderService.getOrderById(orderId)).thenReturn(testOrderDTO);

        // Act & Assert
        mockMvc.perform(get("/api/orders/{orderId}", orderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(orderId))
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.restaurantId").value(restaurantId));
    }

    @Test
    @WithMockUser
    void getCurrentUserOrders_ShouldReturnUserOrders() throws Exception {
        // Arrange
        List<OrderDTO> orders = List.of(testOrderDTO);
        when(orderService.getOrdersByUserId(userId)).thenReturn(orders);

        // Act & Assert
        mockMvc.perform(get("/api/orders/user")
                .with(request -> {
                    request.setAttribute("userId", userId);
                    return request;
                }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(orderId))
                .andExpect(jsonPath("$[0].userId").value(userId));
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    void updateOrderStatus_ShouldReturnUpdatedOrder() throws Exception {
        // Arrange
        testOrderDTO.setStatus(OrderStatus.CONFIRMED);
        when(orderService.updateOrderStatus(eq(orderId), any(UpdateOrderStatusRequest.class))).thenReturn(testOrderDTO);

        // Act & Assert
        mockMvc.perform(put("/api/orders/{orderId}/status", orderId)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateStatusRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(orderId))
                .andExpect(jsonPath("$.status").value(OrderStatus.CONFIRMED.toString()));
    }

    @Test
    @WithMockUser
    void cancelOrder_ShouldReturnCancelledOrder() throws Exception {
        // Arrange
        testOrderDTO.setStatus(OrderStatus.CANCELLED);
        when(orderService.cancelOrder(orderId)).thenReturn(testOrderDTO);

        // Act & Assert
        mockMvc.perform(put("/api/orders/{orderId}/cancel", orderId)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(orderId))
                .andExpect(jsonPath("$.status").value(OrderStatus.CANCELLED.toString()));
    }
}