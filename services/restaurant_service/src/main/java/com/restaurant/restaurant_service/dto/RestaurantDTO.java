package com.restaurant.restaurant_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {
    private Long id;
    private String name;
    private String address;
    private String phoneNumber;
    private String email;
    private String description;
    private String cuisineType;
    private String openingHours;
    private String imageUrl;
    private Boolean isActive;
    private Double averageRating;
    private List<MenuItemDTO> menuItems = new ArrayList<>();
    private List<ReviewDTO> reviews = new ArrayList<>();
}