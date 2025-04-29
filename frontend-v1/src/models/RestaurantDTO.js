/**
 * Data Transfer Object for restaurant data
 * Matches the backend RestaurantDTO.java structure
 */
class RestaurantDTO {
  constructor({
    id = null,
    name = '',
    address = '',
    phoneNumber = '',
    email = '',
    description = '',
    cuisineType = '',
    openingHours = '',
    imageUrl = '',
    isActive = true,
    averageRating = null,
    menuItems = [],
    reviews = []
  } = {}) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.description = description;
    this.cuisineType = cuisineType;
    this.openingHours = openingHours;
    this.imageUrl = imageUrl;
    this.isActive = isActive;
    this.averageRating = averageRating;
    this.menuItems = menuItems;
    this.reviews = reviews;
  }

  /**
   * Create a RestaurantDTO from API response data
   * @param {Object} data - Restaurant data from API
   * @returns {RestaurantDTO} - A new RestaurantDTO instance
   */
  static fromResponse(data) {
    return new RestaurantDTO(data);
  }

  /**
   * Validate the restaurant data
   * @returns {Object} - Object with validation errors
   */
  validate() {
    const errors = {};
    
    if (!this.name) {
      errors.name = 'Restaurant name is required';
    }
    
    if (!this.address) {
      errors.address = 'Address is required';
    }
    
    if (!this.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    if (!this.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(this.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!this.cuisineType) {
      errors.cuisineType = 'Cuisine type is required';
    }
    
    return errors;
  }

  /**
   * Convert to a simple restaurant object for display
   * @returns {Object} - Simple restaurant object
   */
  toSimpleRestaurant() {
    return {
      id: this.id,
      name: this.name,
      cuisine: this.cuisineType,
      rating: this.averageRating,
      imageUrl: this.imageUrl,
      description: this.description
    };
  }
}

export default RestaurantDTO;
