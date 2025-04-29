package com.restaurant.restaurant_service.service.impl;

import com.restaurant.restaurant_service.dto.MenuItemDTO;
import com.restaurant.restaurant_service.exception.ResourceNotFoundException;
import com.restaurant.restaurant_service.model.MenuItem;
import com.restaurant.restaurant_service.model.Restaurant;
import com.restaurant.restaurant_service.repository.MenuItemRepository;
import com.restaurant.restaurant_service.repository.RestaurantRepository;
import com.restaurant.restaurant_service.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuItemServiceImpl implements MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    public List<MenuItemDTO> getAllMenuItems() {
        return menuItemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemDTO> getMenuItemsByRestaurant(Long restaurantId) {
        // Verify restaurant exists
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + restaurantId);
        }
        
        return menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemDTO> getAvailableMenuItemsByRestaurant(Long restaurantId) {
        // Verify restaurant exists
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + restaurantId);
        }
        
        return menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemDTO> getMenuItemsByRestaurantAndCategory(Long restaurantId, String category) {
        // Verify restaurant exists
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + restaurantId);
        }
        
        return menuItemRepository.findByRestaurantIdAndCategoryAndIsAvailableTrue(restaurantId, category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuItemDTO> getMenuItemsByDietaryRequirements(Long restaurantId, Boolean isVegetarian, Boolean isVegan, Boolean isGlutenFree) {
        // Verify restaurant exists
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found with id: " + restaurantId);
        }
        
        List<MenuItem> menuItems;
        
        if (isVegetarian != null && isVegetarian) {
            menuItems = menuItemRepository.findByRestaurantIdAndIsVegetarianAndIsAvailableTrue(restaurantId, true);
        } else if (isVegan != null && isVegan) {
            menuItems = menuItemRepository.findByRestaurantIdAndIsVeganAndIsAvailableTrue(restaurantId, true);
        } else if (isGlutenFree != null && isGlutenFree) {
            menuItems = menuItemRepository.findByRestaurantIdAndIsGlutenFreeAndIsAvailableTrue(restaurantId, true);
        } else {
            menuItems = menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId);
        }
        
        return menuItems.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public MenuItemDTO getMenuItemById(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return convertToDTO(menuItem);
    }

    @Override
    @Transactional
    public MenuItemDTO createMenuItem(MenuItemDTO menuItemDTO) {
        Restaurant restaurant = restaurantRepository.findById(menuItemDTO.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + menuItemDTO.getRestaurantId()));
        
        MenuItem menuItem = convertToEntity(menuItemDTO, restaurant);
        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
        return convertToDTO(savedMenuItem);
    }

    @Override
    @Transactional
    public MenuItemDTO updateMenuItem(Long id, MenuItemDTO menuItemDTO) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        
        // If restaurant ID is different, verify the new restaurant exists
        if (!menuItem.getRestaurant().getId().equals(menuItemDTO.getRestaurantId())) {
            Restaurant newRestaurant = restaurantRepository.findById(menuItemDTO.getRestaurantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + menuItemDTO.getRestaurantId()));
            menuItem.setRestaurant(newRestaurant);
        }
        
        menuItem.setName(menuItemDTO.getName());
        menuItem.setDescription(menuItemDTO.getDescription());
        menuItem.setPrice(menuItemDTO.getPrice());
        menuItem.setCategory(menuItemDTO.getCategory());
        menuItem.setImageUrl(menuItemDTO.getImageUrl());
        menuItem.setIsAvailable(menuItemDTO.getIsAvailable());
        menuItem.setIsVegetarian(menuItemDTO.getIsVegetarian());
        menuItem.setIsVegan(menuItemDTO.getIsVegan());
        menuItem.setIsGlutenFree(menuItemDTO.getIsGlutenFree());
        
        MenuItem updatedMenuItem = menuItemRepository.save(menuItem);
        return convertToDTO(updatedMenuItem);
    }

    @Override
    @Transactional
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu item not found with id: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void setMenuItemAvailability(Long id, Boolean isAvailable) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        menuItem.setIsAvailable(isAvailable);
        menuItemRepository.save(menuItem);
    }

    private MenuItemDTO convertToDTO(MenuItem menuItem) {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId(menuItem.getId());
        dto.setName(menuItem.getName());
        dto.setDescription(menuItem.getDescription());
        dto.setPrice(menuItem.getPrice());
        dto.setCategory(menuItem.getCategory());
        dto.setImageUrl(menuItem.getImageUrl());
        dto.setIsAvailable(menuItem.getIsAvailable());
        dto.setIsVegetarian(menuItem.getIsVegetarian());
        dto.setIsVegan(menuItem.getIsVegan());
        dto.setIsGlutenFree(menuItem.getIsGlutenFree());
        dto.setRestaurantId(menuItem.getRestaurant().getId());
        return dto;
    }

    private MenuItem convertToEntity(MenuItemDTO dto, Restaurant restaurant) {
        MenuItem menuItem = new MenuItem();
        menuItem.setName(dto.getName());
        menuItem.setDescription(dto.getDescription());
        menuItem.setPrice(dto.getPrice());
        menuItem.setCategory(dto.getCategory());
        menuItem.setImageUrl(dto.getImageUrl());
        menuItem.setIsAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true);
        menuItem.setIsVegetarian(dto.getIsVegetarian() != null ? dto.getIsVegetarian() : false);
        menuItem.setIsVegan(dto.getIsVegan() != null ? dto.getIsVegan() : false);
        menuItem.setIsGlutenFree(dto.getIsGlutenFree() != null ? dto.getIsGlutenFree() : false);
        menuItem.setRestaurant(restaurant);
        return menuItem;
    }
}