/**
 * Data Transfer Object for user data
 * Matches the backend UserResponse.java structure
 */
class UserDTO {
  constructor({
    id = null,
    username = '',
    email = '',
    fullName = '',
    phoneNumber = '',
    role = 'CUSTOMER',
    address = '',
    enabled = true,
    available = false,
    currentLocation = null,
    restaurantId = null,
    createdAt = null,
    updatedAt = null
  } = {}) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.address = address;
    this.enabled = enabled;
    this.available = available;
    this.currentLocation = currentLocation;
    this.restaurantId = restaurantId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Create a UserDTO from API response data
   * @param {Object} data - User data from API
   * @returns {UserDTO} - A new UserDTO instance
   */
  static fromResponse(data) {
    return new UserDTO(data);
  }

  /**
   * Create a UserDTO from JWT response
   * @param {Object} jwtResponse - JWT response data
   * @returns {UserDTO} - A new UserDTO instance
   */
  static fromJwtResponse(jwtResponse) {
    return new UserDTO({
      id: jwtResponse.id,
      username: jwtResponse.username,
      email: jwtResponse.email,
      role: jwtResponse.role
    });
  }

  /**
   * Get a human-readable role
   * @returns {string} - Human-readable role
   */
  getRoleText() {
    const roleMap = {
      'CUSTOMER': 'Customer',
      'RESTAURANT_ADMIN': 'Restaurant Admin',
      'DELIVERY_PERSONNEL': 'Delivery Driver',
      'SYSTEM_ADMIN': 'System Admin'
    };
    return roleMap[this.role] || this.role;
  }

  /**
   * Check if the user is a customer
   * @returns {boolean} - True if the user is a customer
   */
  isCustomer() {
    return this.role === 'CUSTOMER';
  }

  /**
   * Check if the user is a restaurant admin
   * @returns {boolean} - True if the user is a restaurant admin
   */
  isRestaurantAdmin() {
    return this.role === 'RESTAURANT_ADMIN';
  }

  /**
   * Check if the user is a delivery driver
   * @returns {boolean} - True if the user is a delivery driver
   */
  isDeliveryDriver() {
    return this.role === 'DELIVERY_PERSONNEL';
  }

  /**
   * Check if the user is a system admin
   * @returns {boolean} - True if the user is a system admin
   */
  isSystemAdmin() {
    return this.role === 'SYSTEM_ADMIN';
  }

  /**
   * Validate the user data
   * @returns {Object} - Object with validation errors
   */
  validate() {
    const errors = {};
    
    if (!this.username) {
      errors.username = 'Username is required';
    }
    
    if (!this.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(this.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!this.fullName) {
      errors.fullName = 'Full name is required';
    }
    
    return errors;
  }
}

export default UserDTO;
