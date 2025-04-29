package com.restaurant.restaurant_service.controller;

import com.restaurant.restaurant_service.dto.ReviewDTO;
import com.restaurant.restaurant_service.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(reviewService.getReviewsByRestaurant(restaurantId));
    }

    @GetMapping("/restaurant/{restaurantId}/sorted")
    public ResponseEntity<List<ReviewDTO>> getReviewsByRestaurantSorted(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(reviewService.getReviewsByRestaurantSorted(restaurantId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }

    @GetMapping("/restaurant/{restaurantId}/rating")
    public ResponseEntity<List<ReviewDTO>> getReviewsByRating(
            @PathVariable Long restaurantId,
            @RequestParam Integer minRating) {
        return ResponseEntity.ok(reviewService.getReviewsByRating(restaurantId, minRating));
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewDTO reviewDTO) {
        return new ResponseEntity<>(reviewService.createReview(reviewDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewDTO> updateReview(@PathVariable Long id, @RequestBody ReviewDTO reviewDTO) {
        return ResponseEntity.ok(reviewService.updateReview(id, reviewDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}