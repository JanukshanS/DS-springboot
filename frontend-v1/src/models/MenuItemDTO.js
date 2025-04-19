/**
 * Data Transfer Object for menu item data
 * Matches the backend MenuItemDTO.java structure
 */
class MenuItemDTO {
  constructor({
    id = null,
    name = '',
    description = '',
    price = 0,
    category = '',
    imageUrl = '',
    isAvailable = true,
    isVegetarian = false,
    isVegan = false,
    isGlutenFree = false,
    restaurantId = null
  } = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.imageUrl = imageUrl;
    this.isAvailable = isAvailable;
    this.isVegetarian = isVegetarian;
    this.isVegan = isVegan;
    this.isGlutenFree = isGlutenFree;
    this.restaurantId = restaurantId;
  }

  /**
   * Create a MenuItemDTO from API response data
   * @param {Object} data - Menu item data from API
   * @returns {MenuItemDTO} - A new MenuItemDTO instance
   */
  static fromResponse(data) {
    return new MenuItemDTO(data);
  }

  /**
   * Validate the menu item data
   * @returns {Object} - Object with validation errors
   */
  validate() {
    const errors = {};
    
    if (!this.name) {
      errors.name = 'Menu item name is required';
    }
    
    if (!this.price || this.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    if (!this.category) {
      errors.category = 'Category is required';
    }
    
    if (!this.restaurantId) {
      errors.restaurantId = 'Restaurant ID is required';
    }
    
    return errors;
  }

  /**
   * Format the price as a currency string
   * @param {string} currencyCode - Currency code (default: USD)
   * @returns {string} - Formatted price
   */
  formattedPrice(currencyCode = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(this.price);
  }
}

export default MenuItemDTO;
