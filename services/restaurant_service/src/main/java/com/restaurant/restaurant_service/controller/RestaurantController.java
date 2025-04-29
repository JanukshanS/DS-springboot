package com.restaurant.restaurant_service.controller;

import com.restaurant.restaurant_service.dto.RestaurantDTO;
import com.restaurant.restaurant_service.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<List<RestaurantDTO>> getAllActiveRestaurants() {
        return ResponseEntity.ok(restaurantService.getActiveRestaurants());
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<RestaurantDTO>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDTO> getRestaurantById(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @PostMapping
    public ResponseEntity<RestaurantDTO> createRestaurant(@RequestBody RestaurantDTO restaurantDTO) {
        return new ResponseEntity<>(restaurantService.createRestaurant(restaurantDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantDTO> updateRestaurant(@PathVariable Long id, @RequestBody RestaurantDTO restaurantDTO) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, restaurantDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<RestaurantDTO>> searchRestaurants(@RequestParam String name) {
        return ResponseEntity.ok(restaurantService.searchRestaurantsByName(name));
    }

    @GetMapping("/cuisine/{cuisineType}")
    public ResponseEntity<List<RestaurantDTO>> getRestaurantsByCuisine(@PathVariable String cuisineType) {
        return ResponseEntity.ok(restaurantService.getRestaurantsByCuisine(cuisineType));
    }

    @GetMapping("/cuisines")
    public ResponseEntity<List<String>> getAllCuisineTypes() {
        return ResponseEntity.ok(restaurantService.getAllCuisineTypes());
    }
}