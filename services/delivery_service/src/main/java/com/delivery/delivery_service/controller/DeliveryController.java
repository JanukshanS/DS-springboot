package com.delivery.delivery_service.controller;

import com.delivery.delivery_service.dto.DeliveryRequest;
import com.delivery.delivery_service.dto.DeliveryResponse;
import com.delivery.delivery_service.model.DeliveryStatus;
import com.delivery.delivery_service.service.DeliveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
@Tag(name = "Delivery API", description = "Endpoints for managing deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping("/create")
    @Operation(summary = "Create a new delivery", security = @SecurityRequirement(name = "bearerAuth"))
    // @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'RESTAURANT_ADMIN')")
    public ResponseEntity<DeliveryResponse> createDelivery(@Valid @RequestBody DeliveryRequest request) {
        DeliveryResponse response = deliveryService.createDelivery(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get delivery by ID", security = @SecurityRequirement(name = "bearerAuth"))
    //@PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'DELIVERY_PERSONNEL', 'RESTAURANT_ADMIN', 'CUSTOMER')")
    public ResponseEntity<DeliveryResponse> getDeliveryById(@PathVariable Long id) {
        DeliveryResponse response = deliveryService.getDeliveryById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get deliveries by order ID", security = @SecurityRequirement(name = "bearerAuth"))
    //@PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'DELIVERY_PERSONNEL', 'RESTAURANT_ADMIN', 'CUSTOMER')")
    public ResponseEntity<List<DeliveryResponse>> getDeliveriesByOrderId(@PathVariable Long orderId) {
        List<DeliveryResponse> responses = deliveryService.getDeliveriesByOrderId(orderId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/driver/{driverId}")
    @Operation(summary = "Get deliveries by driver ID", security = @SecurityRequirement(name = "bearerAuth"))
    //@PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'DELIVERY_PERSONNEL')")
    public ResponseEntity<List<DeliveryResponse>> getDeliveriesByDriverId(@PathVariable Long driverId) {
        List<DeliveryResponse> responses = deliveryService.getDeliveriesByDriverId(driverId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get deliveries by status", security = @SecurityRequirement(name = "bearerAuth"))
    //@PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'DELIVERY_PERSONNEL', 'RESTAURANT_ADMIN')")
    public ResponseEntity<List<DeliveryResponse>> getDeliveriesByStatus(@PathVariable DeliveryStatus status) {
        List<DeliveryResponse> responses = deliveryService.getDeliveriesByStatus(status);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a delivery", security = @SecurityRequirement(name = "bearerAuth"))
    //@PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'DELIVERY_PERSONNEL', 'RESTAURANT_ADMIN')")
    public ResponseEntity<DeliveryResponse> updateDelivery(
            @PathVariable Long id,
            @Valid @RequestBody DeliveryRequest request) {
        DeliveryResponse response = deliveryService.updateDelivery(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update delivery status", security = @SecurityRequirement(name = "bearerAuth"))
    //@PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'DELIVERY_PERSONNEL', 'RESTAURANT_ADMIN')")
    public ResponseEntity<DeliveryResponse> updateDeliveryStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusRequest) {
        DeliveryStatus status = DeliveryStatus.valueOf(statusRequest.get("status"));
        DeliveryResponse response = deliveryService.updateDeliveryStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("{id}/assign")
    @Operation(summary = "Assign a driver to delivery", security = @SecurityRequirement(name = "bearerAuth"))
    //@PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<DeliveryResponse> assignDriverToDelivery(
            @PathVariable Long id,
            @RequestBody Map<String, Object> driverInfo) {
        System.out.println("Controller");
        Long driverId = Long.valueOf(driverInfo.get("driverId").toString());
        String driverName = (String) driverInfo.get("driverName");
        String driverPhone = (String) driverInfo.get("driverPhone");

        DeliveryResponse response = deliveryService.assignDriverToDelivery(id, driverId, driverName, driverPhone);
        return ResponseEntity.ok(response);

    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a delivery", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        deliveryService.deleteDelivery(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/public/tracking/{id}")
    @Operation(summary = "Track delivery status (public endpoint)")
    public ResponseEntity<DeliveryResponse> trackDelivery(@PathVariable Long id) {
        DeliveryResponse response = deliveryService.getDeliveryById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/public/create")
    @Operation(summary = "Create a new delivery (public endpoint)")
    public ResponseEntity<DeliveryResponse> createDeliveryPublic(@Valid @RequestBody DeliveryRequest request) {
        DeliveryResponse response = deliveryService.createDelivery(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("my-deliveries")
    @Operation(summary = "Get current driver's deliveries", security = @SecurityRequirement(name = "bearerAuth"))
    //@PreAuthorize("hasRole('DELIVERY_PERSONNEL')")
    public ResponseEntity<List<DeliveryResponse>> getCurrentDriverDeliveries(@RequestBody Map<String, String> myDeliveryRequest) {
        Long driverId = Long.valueOf(myDeliveryRequest.get("driverId"));
        List<DeliveryResponse> responses = deliveryService.getDeliveriesByDriverId(driverId);
        return ResponseEntity.ok(responses);
    }

}