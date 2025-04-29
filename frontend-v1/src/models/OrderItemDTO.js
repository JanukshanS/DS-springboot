/**
 * Data Transfer Object for order item data
 * Matches the backend OrderItemDTO.java structure
 */
class OrderItemDTO {
  constructor({
    id = null,
    menuItemId = null,
    name = '',
    price = 0,
    quantity = 1,
    subtotal = 0,
    specialInstructions = ''
  } = {}) {
    this.id = id;
    this.menuItemId = menuItemId;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.subtotal = subtotal || (price * quantity);
    this.specialInstructions = specialInstructions;
  }

  /**
   * Create an OrderItemDTO from API response data
   * @param {Object} data - Order item data from API
   * @returns {OrderItemDTO} - A new OrderItemDTO instance
   */
  static fromResponse(data) {
    return new OrderItemDTO(data);
  }

  /**
   * Create an OrderItemDTO from a menu item
   * @param {Object} menuItem - Menu item data
   * @param {number} quantity - Quantity
   * @param {string} specialInstructions - Special instructions
   * @returns {OrderItemDTO} - A new OrderItemDTO instance
   */
  static fromMenuItem(menuItem, quantity = 1, specialInstructions = '') {
    return new OrderItemDTO({
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
      specialInstructions
    });
  }

  /**
   * Update the quantity and recalculate the subtotal
   * @param {number} quantity - New quantity
   */
  updateQuantity(quantity) {
    this.quantity = quantity;
    this.subtotal = this.price * this.quantity;
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

  /**
   * Format the subtotal as a currency string
   * @param {string} currencyCode - Currency code (default: USD)
   * @returns {string} - Formatted subtotal
   */
  formattedSubtotal(currencyCode = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(this.subtotal);
  }
}

export default OrderItemDTO;
