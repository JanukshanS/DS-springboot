package com.restaurant.restaurant_service.service.impl;

import com.restaurant.restaurant_service.dto.RestaurantDTO;
import com.restaurant.restaurant_service.exception.ResourceNotFoundException;
import com.restaurant.restaurant_service.model.Restaurant;
import com.restaurant.restaurant_service.model.Review;
import com.restaurant.restaurant_service.repository.RestaurantRepository;
import com.restaurant.restaurant_service.repository.ReviewRepository;
import com.restaurant.restaurant_service.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public List<RestaurantDTO> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantDTO> getActiveRestaurants() {
        return restaurantRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RestaurantDTO getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        return convertToDTO(restaurant);
    }

    @Override
    @Transactional
    public RestaurantDTO createRestaurant(RestaurantDTO restaurantDTO) {
        Restaurant restaurant = convertToEntity(restaurantDTO);
        restaurant.setIsActive(true);
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return convertToDTO(savedRestaurant);
    }

    @Override
    @Transactional
    public RestaurantDTO updateRestaurant(Long id, RestaurantDTO restaurantDTO) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        
        restaurant.setName(restaurantDTO.getName());
        restaurant.setAddress(restaurantDTO.getAddress());
        restaurant.setPhoneNumber(restaurantDTO.getPhoneNumber());
        restaurant.setEmail(restaurantDTO.getEmail());
        restaurant.setDescription(restaurantDTO.getDescription());
        restaurant.setCuisineType(restaurantDTO.getCuisineType());
        restaurant.setOpeningHours(restaurantDTO.getOpeningHours());
        restaurant.setImageUrl(restaurantDTO.getImageUrl());
        restaurant.setIsActive(restaurantDTO.getIsActive());
        
        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
        return convertToDTO(updatedRestaurant);
    }

    @Override
    @Transactional
    public void deleteRestaurant(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        restaurant.setIsActive(false);
        restaurantRepository.save(restaurant);
    }

    @Override
    public List<RestaurantDTO> searchRestaurantsByName(String name) {
        return restaurantRepository.searchByName(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantDTO> getRestaurantsByCuisine(String cuisineType) {
        return restaurantRepository.findByCuisineTypeAndIsActiveTrue(cuisineType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getAllCuisineTypes() {
        return restaurantRepository.findAllCuisineTypes();
    }

    @Override
    @Transactional
    public void updateRestaurantRating(Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
        
        List<Review> reviews = reviewRepository.findByRestaurantId(restaurantId);
        
        if (reviews.isEmpty()) {
            restaurant.setAverageRating(0.0);
        } else {
            double average = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            restaurant.setAverageRating(average);
        }
        
        restaurantRepository.save(restaurant);
    }

    private RestaurantDTO convertToDTO(Restaurant restaurant) {
        RestaurantDTO dto = new RestaurantDTO();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setAddress(restaurant.getAddress());
        dto.setPhoneNumber(restaurant.getPhoneNumber());
        dto.setEmail(restaurant.getEmail());
        dto.setDescription(restaurant.getDescription());
        dto.setCuisineType(restaurant.getCuisineType());
        dto.setOpeningHours(restaurant.getOpeningHours());
        dto.setImageUrl(restaurant.getImageUrl());
        dto.setIsActive(restaurant.getIsActive());
        dto.setAverageRating(restaurant.getAverageRating());
        return dto;
    }

    private Restaurant convertToEntity(RestaurantDTO dto) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(dto.getName());
        restaurant.setAddress(dto.getAddress());
        restaurant.setPhoneNumber(dto.getPhoneNumber());
        restaurant.setEmail(dto.getEmail());
        restaurant.setDescription(dto.getDescription());
        restaurant.setCuisineType(dto.getCuisineType());
        restaurant.setOpeningHours(dto.getOpeningHours());
        restaurant.setImageUrl(dto.getImageUrl());
        restaurant.setIsActive(dto.getIsActive());
        restaurant.setAverageRating(dto.getAverageRating());
        return restaurant;
    }
}