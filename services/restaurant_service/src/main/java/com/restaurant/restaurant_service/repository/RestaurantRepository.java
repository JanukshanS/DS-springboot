package com.restaurant.restaurant_service.repository;

import com.restaurant.restaurant_service.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    
    List<Restaurant> findByIsActiveTrue();
    
    List<Restaurant> findByCuisineTypeAndIsActiveTrue(String cuisineType);
    
    @Query("SELECT r FROM Restaurant r WHERE r.name LIKE %?1% AND r.isActive = true")
    List<Restaurant> searchByName(String name);
    
    @Query("SELECT DISTINCT r.cuisineType FROM Restaurant r WHERE r.cuisineType IS NOT NULL")
    List<String> findAllCuisineTypes();
}