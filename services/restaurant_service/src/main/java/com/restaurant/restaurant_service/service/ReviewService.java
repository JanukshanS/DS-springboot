package com.restaurant.restaurant_service.service;

import com.restaurant.restaurant_service.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {
    
    List<ReviewDTO> getAllReviews();
    
    List<ReviewDTO> getReviewsByRestaurant(Long restaurantId);
    
    List<ReviewDTO> getReviewsByRestaurantSorted(Long restaurantId);
    
    List<ReviewDTO> getReviewsByUser(Long userId);
    
    List<ReviewDTO> getReviewsByRating(Long restaurantId, Integer minRating);
    
    ReviewDTO getReviewById(Long id);
    
    ReviewDTO createReview(ReviewDTO reviewDTO);
    
    ReviewDTO updateReview(Long id, ReviewDTO reviewDTO);
    
    void deleteReview(Long id);
}