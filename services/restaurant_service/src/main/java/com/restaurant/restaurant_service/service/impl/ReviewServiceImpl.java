package com.restaurant.restaurant_service.service.impl;

import com.restaurant.restaurant_service.dto.ReviewDTO;
import com.restaurant.restaurant_service.exception.ResourceNotFoundException;
import com.restaurant.restaurant_service.model.Restaurant;
import com.restaurant.restaurant_service.model.Review;
import com.restaurant.restaurant_service.repository.RestaurantRepository;
import com.restaurant.restaurant_service.repository.ReviewRepository;
import com.restaurant.restaurant_service.service.RestaurantService;
import com.restaurant.restaurant_service.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantService restaurantService;

    @Override
    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByRestaurant(Long restaurantId) {
        // Verify restaurant exists
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + restaurantId);
        }
        
        return reviewRepository.findByRestaurantId(restaurantId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByRestaurantSorted(Long restaurantId) {
        // Verify restaurant exists
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + restaurantId);
        }
        
        return reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByRating(Long restaurantId, Integer minRating) {
        // Verify restaurant exists
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + restaurantId);
        }
        
        return reviewRepository.findByRestaurantIdAndRatingGreaterThanEqual(restaurantId, minRating).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewDTO getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        return convertToDTO(review);
    }

    @Override
    @Transactional
    public ReviewDTO createReview(ReviewDTO reviewDTO) {
        Restaurant restaurant = restaurantRepository.findById(reviewDTO.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + reviewDTO.getRestaurantId()));
        
        Review review = convertToEntity(reviewDTO, restaurant);
        review.setCreatedAt(LocalDateTime.now());
        Review savedReview = reviewRepository.save(review);
        
        // Update restaurant rating
        restaurantService.updateRestaurantRating(restaurant.getId());
        
        return convertToDTO(savedReview);
    }

    @Override
    @Transactional
    public ReviewDTO updateReview(Long id, ReviewDTO reviewDTO) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        
        // If restaurant ID is different, verify the new restaurant exists
        if (!review.getRestaurant().getId().equals(reviewDTO.getRestaurantId())) {
            Restaurant newRestaurant = restaurantRepository.findById(reviewDTO.getRestaurantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + reviewDTO.getRestaurantId()));
            review.setRestaurant(newRestaurant);
        }
        
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setUserId(reviewDTO.getUserId());
        review.setUserName(reviewDTO.getUserName());
        
        Review updatedReview = reviewRepository.save(review);
        
        // Update restaurant rating
        restaurantService.updateRestaurantRating(updatedReview.getRestaurant().getId());
        
        return convertToDTO(updatedReview);
    }

    @Override
    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        
        Long restaurantId = review.getRestaurant().getId();
        reviewRepository.deleteById(id);
        
        // Update restaurant rating
        restaurantService.updateRestaurantRating(restaurantId);
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setUserId(review.getUserId());
        dto.setUserName(review.getUserName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setRestaurantId(review.getRestaurant().getId());
        return dto;
    }

    private Review convertToEntity(ReviewDTO dto, Restaurant restaurant) {
        Review review = new Review();
        review.setUserId(dto.getUserId());
        review.setUserName(dto.getUserName());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setRestaurant(restaurant);
        return review;
    }
}