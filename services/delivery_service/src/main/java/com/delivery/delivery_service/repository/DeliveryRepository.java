package com.delivery.delivery_service.repository;

import com.delivery.delivery_service.model.Delivery;
import com.delivery.delivery_service.model.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    
    List<Delivery> findByOrderId(Long orderId);
    
    List<Delivery> findByDriverId(Long driverId);
    
    List<Delivery> findByStatus(DeliveryStatus status);
    
    List<Delivery> findByDriverIdAndStatus(Long driverId, DeliveryStatus status);
}