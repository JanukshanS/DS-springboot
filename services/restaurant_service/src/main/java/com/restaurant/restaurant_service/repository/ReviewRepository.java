package com.restaurant.restaurant_service.repository;

import com.restaurant.restaurant_service.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByRestaurantId(Long restaurantId);
    
    List<Review> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    
    List<Review> findByUserId(Long userId);
    
    List<Review> findByRestaurantIdAndRatingGreaterThanEqual(Long restaurantId, Integer rating);
}