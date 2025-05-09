package com.restaurant.restaurant_service.repository;

import com.restaurant.restaurant_service.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    /**
     * Find all menu items for a restaurant regardless of availability status
     * Used for the restaurant dashboard view
     */
    List<MenuItem> findByRestaurantId(Long restaurantId);
    
    /**
     * Find only available menu items for a restaurant
     * Used for customer-facing views
     */
    List<MenuItem> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);
    
    List<MenuItem> findByRestaurantIdAndCategoryAndIsAvailableTrue(Long restaurantId, String category);
    
    List<MenuItem> findByCategoryAndIsAvailableTrue(String category);
    
    List<MenuItem> findByRestaurantIdAndIsVegetarianAndIsAvailableTrue(Long restaurantId, Boolean isVegetarian);
    
    List<MenuItem> findByRestaurantIdAndIsVeganAndIsAvailableTrue(Long restaurantId, Boolean isVegan);
    
    List<MenuItem> findByRestaurantIdAndIsGlutenFreeAndIsAvailableTrue(Long restaurantId, Boolean isGlutenFree);
}