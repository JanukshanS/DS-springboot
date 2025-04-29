package com.delivery.delivery_service.service;

import com.delivery.delivery_service.dto.DeliveryRequest;
import com.delivery.delivery_service.dto.DeliveryResponse;
import com.delivery.delivery_service.model.Delivery;
import com.delivery.delivery_service.model.DeliveryStatus;
import com.delivery.delivery_service.repository.DeliveryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    @Transactional
    public DeliveryResponse createDelivery(DeliveryRequest request) {
        log.info("Creating new delivery for order ID: {}", request.getOrderId());
        
        Delivery delivery = Delivery.builder()
                .orderId(request.getOrderId())
                .driverId(request.getDriverId())
                .driverName(request.getDriverName())
                .driverPhone(request.getDriverPhone())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .deliveryAddress(request.getDeliveryAddress())
                .restaurantName(request.getRestaurantName())
                .restaurantAddress(request.getRestaurantAddress())
                .status(request.getStatus() != null ? request.getStatus() : DeliveryStatus.PENDING)
                .pickupLatitude(request.getPickupLatitude())
                .pickupLongitude(request.getPickupLongitude())
                .deliveryLatitude(request.getDeliveryLatitude())
                .deliveryLongitude(request.getDeliveryLongitude())
                .notes(request.getNotes())
                .build();

        Delivery savedDelivery = deliveryRepository.save(delivery);
        log.info("Created delivery with ID: {}", savedDelivery.getId());
        
        return mapToDeliveryResponse(savedDelivery);
    }

    @Transactional(readOnly = true)
    public DeliveryResponse getDeliveryById(Long id) {
        log.info("Fetching delivery with ID: {}", id);
        
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Delivery not found with ID: " + id));
        
        return mapToDeliveryResponse(delivery);
    }

    @Transactional(readOnly = true)
    public List<DeliveryResponse> getDeliveriesByOrderId(Long orderId) {
        log.info("Fetching deliveries for order ID: {}", orderId);
        
        List<Delivery> deliveries = deliveryRepository.findByOrderId(orderId);
        
        return deliveries.stream()
                .map(this::mapToDeliveryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeliveryResponse> getDeliveriesByDriverId(Long driverId) {
        log.info("Fetching deliveries for driver ID: {}", driverId);
        
        List<Delivery> deliveries = deliveryRepository.findByDriverId(driverId);
        
        return deliveries.stream()
                .map(this::mapToDeliveryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeliveryResponse> getDeliveriesByStatus(DeliveryStatus status) {
        log.info("Fetching deliveries with status: {}", status);
        
        List<Delivery> deliveries = deliveryRepository.findByStatus(status);
        
        return deliveries.stream()
                .map(this::mapToDeliveryResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeliveryResponse assignDriverToDelivery(Long deliveryId, Long driverId, String driverName, String driverPhone) {
        log.info("Assigning driver ID: {} to delivery ID: {}", driverId, deliveryId);
        
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new EntityNotFoundException("Delivery not found with ID: " + deliveryId));
        
        delivery.setDriverId(driverId);
        delivery.setDriverName(driverName);
        delivery.setDriverPhone(driverPhone);
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        delivery.setAssignedAt(LocalDateTime.now());
        
        Delivery updatedDelivery = deliveryRepository.save(delivery);
        log.info("Driver assigned to delivery with ID: {}", deliveryId);
        
        return mapToDeliveryResponse(updatedDelivery);
    }

    @Transactional
    public DeliveryResponse updateDeliveryStatus(Long deliveryId, DeliveryStatus status) {
        log.info("Updating delivery ID: {} to status: {}", deliveryId, status);
        
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new EntityNotFoundException("Delivery not found with ID: " + deliveryId));
        
        delivery.setStatus(status);
        
        // Update timestamps based on status
        if (status == DeliveryStatus.PICKED_UP) {
            delivery.setPickedUpAt(LocalDateTime.now());
        } else if (status == DeliveryStatus.DELIVERED) {
            delivery.setDeliveredAt(LocalDateTime.now());
        }
        
        Delivery updatedDelivery = deliveryRepository.save(delivery);
        log.info("Updated delivery status to: {} for delivery ID: {}", status, deliveryId);
        
        return mapToDeliveryResponse(updatedDelivery);
    }

    @Transactional
    public DeliveryResponse updateDelivery(Long id, DeliveryRequest request) {
        log.info("Updating delivery with ID: {}", id);
        
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Delivery not found with ID: " + id));
        
        if (request.getDriverId() != null) {
            delivery.setDriverId(request.getDriverId());
        }
        
        if (request.getDriverName() != null) {
            delivery.setDriverName(request.getDriverName());
        }
        
        if (request.getDriverPhone() != null) {
            delivery.setDriverPhone(request.getDriverPhone());
        }
        
        if (request.getCustomerName() != null) {
            delivery.setCustomerName(request.getCustomerName());
        }
        
        if (request.getCustomerPhone() != null) {
            delivery.setCustomerPhone(request.getCustomerPhone());
        }
        
        if (request.getDeliveryAddress() != null) {
            delivery.setDeliveryAddress(request.getDeliveryAddress());
        }
        
        if (request.getRestaurantName() != null) {
            delivery.setRestaurantName(request.getRestaurantName());
        }
        
        if (request.getRestaurantAddress() != null) {
            delivery.setRestaurantAddress(request.getRestaurantAddress());
        }
        
        if (request.getStatus() != null) {
            delivery.setStatus(request.getStatus());
        }
        
        if (request.getPickupLatitude() != null) {
            delivery.setPickupLatitude(request.getPickupLatitude());
        }
        
        if (request.getPickupLongitude() != null) {
            delivery.setPickupLongitude(request.getPickupLongitude());
        }
        
        if (request.getDeliveryLatitude() != null) {
            delivery.setDeliveryLatitude(request.getDeliveryLatitude());
        }
        
        if (request.getDeliveryLongitude() != null) {
            delivery.setDeliveryLongitude(request.getDeliveryLongitude());
        }
        
        if (request.getNotes() != null) {
            delivery.setNotes(request.getNotes());
        }
        
        Delivery updatedDelivery = deliveryRepository.save(delivery);
        log.info("Updated delivery with ID: {}", id);
        
        return mapToDeliveryResponse(updatedDelivery);
    }

    @Transactional
    public void deleteDelivery(Long id) {
        log.info("Deleting delivery with ID: {}", id);
        
        if (!deliveryRepository.existsById(id)) {
            throw new EntityNotFoundException("Delivery not found with ID: " + id);
        }
        
        deliveryRepository.deleteById(id);
        log.info("Deleted delivery with ID: {}", id);
    }

    private DeliveryResponse mapToDeliveryResponse(Delivery delivery) {
        return DeliveryResponse.builder()
                .id(delivery.getId())
                .orderId(delivery.getOrderId())
                .driverId(delivery.getDriverId())
                .driverName(delivery.getDriverName())
                .driverPhone(delivery.getDriverPhone())
                .customerName(delivery.getCustomerName())
                .customerPhone(delivery.getCustomerPhone())
                .deliveryAddress(delivery.getDeliveryAddress())
                .restaurantName(delivery.getRestaurantName())
                .restaurantAddress(delivery.getRestaurantAddress())
                .status(delivery.getStatus())
                .assignedAt(delivery.getAssignedAt())
                .pickedUpAt(delivery.getPickedUpAt())
                .deliveredAt(delivery.getDeliveredAt())
                .pickupLatitude(delivery.getPickupLatitude())
                .pickupLongitude(delivery.getPickupLongitude())
                .deliveryLatitude(delivery.getDeliveryLatitude())
                .deliveryLongitude(delivery.getDeliveryLongitude())
                .notes(delivery.getNotes())
                .createdAt(delivery.getCreatedAt())
                .updatedAt(delivery.getUpdatedAt())
                .build();
    }
}