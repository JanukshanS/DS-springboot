/**
 * Data Transfer Object for payment data
 * Matches the backend PaymentDTO.java structure
 */
class PaymentDTO {
  constructor({
    id = null,
    userId = null,
    orderId = null,
    amount = 0,
    paymentMethod = 'CREDIT_CARD',
    paymentMethodId = null,
    status = 'PENDING',
    transactionId = null,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.userId = userId;
    this.orderId = orderId;
    this.amount = amount;
    this.paymentMethod = paymentMethod;
    this.paymentMethodId = paymentMethodId;
    this.status = status;
    this.transactionId = transactionId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Create a PaymentDTO from API response data
   * @param {Object} data - Payment data from API
   * @returns {PaymentDTO} - A new PaymentDTO instance
   */
  static fromResponse(data) {
    return new PaymentDTO(data);
  }

  /**
   * Create a new payment from order data
   * @param {number} userId - User ID
   * @param {number} orderId - Order ID
   * @param {number} amount - Payment amount
   * @param {string} paymentMethod - Payment method
   * @param {string} paymentMethodId - Payment method ID (for saved payment methods)
   * @returns {PaymentDTO} - A new PaymentDTO instance
   */
  static createFromOrder(userId, orderId, amount, paymentMethod = 'CREDIT_CARD', paymentMethodId = null) {
    return new PaymentDTO({
      userId,
      orderId,
      amount,
      paymentMethod,
      paymentMethodId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Format the amount as a currency string
   * @param {string} currencyCode - Currency code (default: USD)
   * @returns {string} - Formatted amount
   */
  formattedAmount(currencyCode = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(this.amount);
  }

  /**
   * Get a human-readable status
   * @returns {string} - Human-readable status
   */
  getStatusText() {
    const statusMap = {
      'PENDING': 'Pending',
      'PROCESSING': 'Processing',
      'COMPLETED': 'Completed',
      'FAILED': 'Failed',
      'REFUNDED': 'Refunded',
      'CANCELLED': 'Cancelled'
    };
    return statusMap[this.status] || this.status;
  }

  /**
   * Get a human-readable payment method
   * @returns {string} - Human-readable payment method
   */
  getPaymentMethodText() {
    const methodMap = {
      'CREDIT_CARD': 'Credit Card',
      'DEBIT_CARD': 'Debit Card',
      'PAYPAL': 'PayPal',
      'APPLE_PAY': 'Apple Pay',
      'GOOGLE_PAY': 'Google Pay',
      'CASH': 'Cash on Delivery'
    };
    return methodMap[this.paymentMethod] || this.paymentMethod;
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
   * Validate the payment data
   * @returns {Object} - Object with validation errors
   */
  validate() {
    const errors = {};
    
    if (!this.userId) {
      errors.userId = 'User ID is required';
    }
    
    if (!this.orderId) {
      errors.orderId = 'Order ID is required';
    }
    
    if (!this.amount || this.amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (!this.paymentMethod) {
      errors.paymentMethod = 'Payment method is required';
    }
    
    return errors;
  }
}

export default PaymentDTO;
