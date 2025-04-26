package com.order.order_service.controller;

import com.order.order_service.dto.CreateOrderRequest;
import com.order.order_service.dto.OrderDTO;
import com.order.order_service.dto.UpdateOrderStatusRequest;
import com.order.order_service.service.OrderService;
import com.order.order_service.model.OrderStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody CreateOrderRequest createOrderRequest) {
        Long userId = createOrderRequest.getUserId(); // Take userId from request body
        OrderDTO createdOrder = orderService.createOrder(createOrderRequest, userId);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        OrderDTO order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByRestaurantId(@PathVariable Long restaurantId) {
        List<OrderDTO> orders = orderService.getOrdersByRestaurantId(restaurantId);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId, @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, request);
        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping("/{orderId}/delivery-personnel/{deliveryPersonnelId}")
    public ResponseEntity<OrderDTO> assignDeliveryPersonnel(@PathVariable Long orderId, @PathVariable Long deliveryPersonnelId) {
        OrderDTO updatedOrder = orderService.assignDeliveryPersonnel(orderId, deliveryPersonnelId);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<OrderDTO> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/delivery-personnel/{deliveryPersonnelId}")
    public ResponseEntity<List<OrderDTO>> getOrdersForDeliveryPersonnel(@PathVariable Long deliveryPersonnelId) {
        List<OrderDTO> orders = orderService.getOrdersByDeliveryPersonnelId(deliveryPersonnelId);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/payment")
    public ResponseEntity<Void> updatePaymentInfo(@PathVariable Long orderId, @RequestParam String paymentId, @RequestParam boolean isPaid) {
        orderService.updatePaymentInfo(orderId, paymentId, isPaid);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long orderId) {
        OrderDTO cancelledOrder = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(cancelledOrder);
    }
}
