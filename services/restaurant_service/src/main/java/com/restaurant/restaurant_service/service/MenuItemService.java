package com.restaurant.restaurant_service.service;

import com.restaurant.restaurant_service.dto.MenuItemDTO;

import java.util.List;

public interface MenuItemService {
    
    List<MenuItemDTO> getAllMenuItems();
    
    List<MenuItemDTO> getMenuItemsByRestaurant(Long restaurantId);
    
    List<MenuItemDTO> getAvailableMenuItemsByRestaurant(Long restaurantId);
    
    List<MenuItemDTO> getMenuItemsByRestaurantAndCategory(Long restaurantId, String category);
    
    List<MenuItemDTO> getMenuItemsByDietaryRequirements(Long restaurantId, Boolean isVegetarian, Boolean isVegan, Boolean isGlutenFree);
    
    MenuItemDTO getMenuItemById(Long id);
    
    MenuItemDTO createMenuItem(MenuItemDTO menuItemDTO);
    
    MenuItemDTO updateMenuItem(Long id, MenuItemDTO menuItemDTO);
    
    void deleteMenuItem(Long id);
    
    void setMenuItemAvailability(Long id, Boolean isAvailable);
}