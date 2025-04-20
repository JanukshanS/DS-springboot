/**
 * Data Transfer Object for user signup
 * This model matches the backend SignupRequest.java class
 */
class SignupRequest {
  constructor({
    username,
    email,
    password,
    fullName,
    phoneNumber,
    role = 'CUSTOMER',
    address = '',
    available = false,
    currentLocation = '',
    restaurantId = null
  }) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.address = address;
    this.available = available; // For delivery personnel
    this.currentLocation = currentLocation; // For delivery personnel
    this.restaurantId = restaurantId; // For restaurant admin
  }

  /**
   * Validate the signup request data
   * @returns Object with validation errors or empty object if valid
   */
  validate() {
    const errors = {};

    if (!this.username || this.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!this.email || !/\S+@\S+\.\S+/.test(this.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!this.password || this.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!this.fullName || this.fullName.trim().length < 2) {
      errors.fullName = 'Full name is required';
    }

    if (this.phoneNumber && !/^\d{10}$/.test(this.phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    // Role-specific validations
    if (this.role === 'RESTAURANT_ADMIN' && !this.restaurantId) {
      errors.restaurantId = 'Restaurant ID is required for restaurant admins';
    }

    if (this.role === 'DELIVERY_PERSONNEL') {
      if (!this.available) {
        errors.available = 'Availability status is required for delivery personnel';
      }
    }

    return errors;
  }

  /**
   * Create a SignupRequest instance from user data
   * @param {Object} userData - User data object
   * @returns {SignupRequest} New SignupRequest instance
   */
  static fromUserData(userData) {
    return new SignupRequest({
      username: userData.username || userData.email?.split('@')[0] || '',
      email: userData.email || '',
      password: userData.password || '',
      fullName: userData.fullName || userData.name || '',
      phoneNumber: userData.phoneNumber || userData.phone || '',
      role: userData.role || 'CUSTOMER',
      address: userData.address || '',
      available: userData.available || false,
      currentLocation: userData.currentLocation || '',
      restaurantId: userData.restaurantId || null
    });
  }
}

export default SignupRequest;
