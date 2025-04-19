/**
 * Data Transfer Object for delivery data
 * Matches the backend DeliveryDTO.java structure
 */
class DeliveryDTO {
  constructor({
    id = null,
    orderId = null,
    driverId = null,
    driverName = '',
    status = 'PENDING',
    pickupAddress = '',
    deliveryAddress = '',
    currentLocation = null,
    estimatedDeliveryTime = null,
    actualDeliveryTime = null,
    notes = '',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.orderId = orderId;
    this.driverId = driverId;
    this.driverName = driverName;
    this.status = status;
    this.pickupAddress = pickupAddress;
    this.deliveryAddress = deliveryAddress;
    this.currentLocation = currentLocation;
    this.estimatedDeliveryTime = estimatedDeliveryTime;
    this.actualDeliveryTime = actualDeliveryTime;
    this.notes = notes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Create a DeliveryDTO from API response data
   * @param {Object} data - Delivery data from API
   * @returns {DeliveryDTO} - A new DeliveryDTO instance
   */
  static fromResponse(data) {
    return new DeliveryDTO(data);
  }

  /**
   * Create a new delivery from order data
   * @param {number} orderId - Order ID
   * @param {string} pickupAddress - Pickup address
   * @param {string} deliveryAddress - Delivery address
   * @param {string} estimatedDeliveryTime - Estimated delivery time
   * @returns {DeliveryDTO} - A new DeliveryDTO instance
   */
  static createFromOrder(orderId, pickupAddress, deliveryAddress, estimatedDeliveryTime = null) {
    return new DeliveryDTO({
      orderId,
      status: 'PENDING',
      pickupAddress,
      deliveryAddress,
      estimatedDeliveryTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Get a human-readable status
   * @returns {string} - Human-readable status
   */
  getStatusText() {
    const statusMap = {
      'PENDING': 'Pending',
      'ASSIGNED': 'Assigned',
      'PICKED_UP': 'Picked Up',
      'IN_TRANSIT': 'In Transit',
      'DELIVERED': 'Delivered',
      'FAILED': 'Failed',
      'CANCELLED': 'Cancelled'
    };
    return statusMap[this.status] || this.status;
  }

  /**
   * Format the estimated delivery time
   * @returns {string} - Formatted time
   */
  formattedEstimatedDeliveryTime() {
    if (!this.estimatedDeliveryTime) return 'Not available';
    
    return new Date(this.estimatedDeliveryTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format the actual delivery time
   * @returns {string} - Formatted time
   */
  formattedActualDeliveryTime() {
    if (!this.actualDeliveryTime) return 'Not delivered yet';
    
    return new Date(this.actualDeliveryTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Calculate the estimated time remaining
   * @returns {number} - Minutes remaining
   */
  getTimeRemaining() {
    if (!this.estimatedDeliveryTime) return null;
    
    const now = new Date();
    const estimatedTime = new Date(this.estimatedDeliveryTime);
    const diffMs = estimatedTime - now;
    
    if (diffMs <= 0) return 0;
    
    return Math.ceil(diffMs / (1000 * 60)); // Convert to minutes
  }

  /**
   * Validate the delivery data
   * @returns {Object} - Object with validation errors
   */
  validate() {
    const errors = {};
    
    if (!this.orderId) {
      errors.orderId = 'Order ID is required';
    }
    
    if (!this.pickupAddress) {
      errors.pickupAddress = 'Pickup address is required';
    }
    
    if (!this.deliveryAddress) {
      errors.deliveryAddress = 'Delivery address is required';
    }
    
    return errors;
  }
}

export default DeliveryDTO;
