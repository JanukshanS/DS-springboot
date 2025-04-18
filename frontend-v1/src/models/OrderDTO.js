/**
 * Data Transfer Object for order data
 * Matches the backend OrderDTO.java structure
 */
class OrderDTO {
  constructor({
    id = null,
    userId = null,
    restaurantId = null,
    restaurantName = '',
    items = [],
    status = 'PENDING',
    totalAmount = 0,
    deliveryAddress = '',
    deliveryFee = 0,
    deliveryPersonnelId = null,
    paymentMethod = 'CREDIT_CARD',
    paymentStatus = 'PENDING',
    specialInstructions = '',
    createdAt = new Date().toISOString(),
    estimatedDeliveryTime = null
  } = {}) {
    this.id = id;
    this.userId = userId;
    this.restaurantId = restaurantId;
    this.restaurantName = restaurantName;
    this.items = items;
    this.status = status;
    this.totalAmount = totalAmount;
    this.deliveryAddress = deliveryAddress;
    this.deliveryFee = deliveryFee;
    this.deliveryPersonnelId = deliveryPersonnelId;
    this.paymentMethod = paymentMethod;
    this.paymentStatus = paymentStatus;
    this.specialInstructions = specialInstructions;
    this.createdAt = createdAt;
    this.estimatedDeliveryTime = estimatedDeliveryTime;
  }

  /**
   * Create an OrderDTO from API response data
   * @param {Object} data - Order data from API
   * @returns {OrderDTO} - A new OrderDTO instance
   */
  static fromResponse(data) {
    return new OrderDTO(data);
  }

  /**
   * Create a new order from cart data
   * @param {number} userId - User ID
   * @param {number} restaurantId - Restaurant ID
   * @param {string} restaurantName - Restaurant name
   * @param {Array} items - Order items
   * @param {string} deliveryAddress - Delivery address
   * @param {number} deliveryFee - Delivery fee
   * @param {string} paymentMethod - Payment method
   * @param {string} specialInstructions - Special instructions
   * @returns {OrderDTO} - A new OrderDTO instance
   */
  static createFromCart(
    userId,
    restaurantId,
    restaurantName,
    items,
    deliveryAddress,
    deliveryFee = 0,
    paymentMethod = 'CREDIT_CARD',
    specialInstructions = ''
  ) {
    // Calculate total amount
    const itemsTotal = items.reduce((total, item) => total + item.subtotal, 0);
    const totalAmount = itemsTotal + deliveryFee;

    return new OrderDTO({
      userId,
      restaurantId,
      restaurantName,
      items,
      status: 'PENDING',
      totalAmount,
      deliveryAddress,
      deliveryFee,
      paymentMethod,
      paymentStatus: 'PENDING',
      specialInstructions,
      createdAt: new Date().toISOString()
    });
  }

  /**
   * Calculate the total amount
   * @returns {number} - Total amount
   */
  calculateTotal() {
    const itemsTotal = this.items.reduce((total, item) => total + item.subtotal, 0);
    return itemsTotal + this.deliveryFee;
  }

  /**
   * Format the total amount as a currency string
   * @param {string} currencyCode - Currency code (default: USD)
   * @returns {string} - Formatted total amount
   */
  formattedTotal(currencyCode = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(this.totalAmount);
  }

  /**
   * Format the delivery fee as a currency string
   * @param {string} currencyCode - Currency code (default: USD)
   * @returns {string} - Formatted delivery fee
   */
  formattedDeliveryFee(currencyCode = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(this.deliveryFee);
  }

  /**
   * Format the creation date
   * @returns {string} - Formatted date
   */
  formattedDate() {
    return new Date(this.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get a human-readable status
   * @returns {string} - Human-readable status
   */
  getStatusText() {
    const statusMap = {
      'PENDING': 'Pending',
      'CONFIRMED': 'Confirmed',
      'PREPARING': 'Preparing',
      'READY_FOR_PICKUP': 'Ready for Pickup',
      'OUT_FOR_DELIVERY': 'Out for Delivery',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled'
    };
    return statusMap[this.status] || this.status;
  }

  /**
   * Validate the order data
   * @returns {Object} - Object with validation errors
   */
  validate() {
    const errors = {};
    
    if (!this.userId) {
      errors.userId = 'User ID is required';
    }
    
    if (!this.restaurantId) {
      errors.restaurantId = 'Restaurant ID is required';
    }
    
    if (!this.items || this.items.length === 0) {
      errors.items = 'Order must contain at least one item';
    }
    
    if (!this.deliveryAddress) {
      errors.deliveryAddress = 'Delivery address is required';
    }
    
    return errors;
  }
}

export default OrderDTO;
