package com.restaurant.restaurant_service.service;

import com.restaurant.restaurant_service.dto.RestaurantDTO;

import java.util.List;

public interface RestaurantService {
    
    List<RestaurantDTO> getAllRestaurants();
    
    List<RestaurantDTO> getActiveRestaurants();
    
    RestaurantDTO getRestaurantById(Long id);
    
    RestaurantDTO createRestaurant(RestaurantDTO restaurantDTO);
    
    RestaurantDTO updateRestaurant(Long id, RestaurantDTO restaurantDTO);
    
    void deleteRestaurant(Long id);
    
    List<RestaurantDTO> searchRestaurantsByName(String name);
    
    List<RestaurantDTO> getRestaurantsByCuisine(String cuisineType);
    
    List<String> getAllCuisineTypes();
    
    void updateRestaurantRating(Long restaurantId);
}