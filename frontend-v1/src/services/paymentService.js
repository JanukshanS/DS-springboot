/**
 * Payment service using Stripe
 */

// Stripe public key from environment variables
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

/**
 * Load Stripe.js script
 * @returns {Promise} Promise that resolves when Stripe is loaded
 */
export const loadStripe = () => {
  return new Promise((resolve, reject) => {
    // Check if Stripe is already loaded
    if (window.Stripe) {
      resolve(window.Stripe(STRIPE_PUBLIC_KEY));
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    
    // Set up callbacks
    script.onload = () => {
      const stripe = window.Stripe(STRIPE_PUBLIC_KEY);
      resolve(stripe);
    };
    script.onerror = (error) => reject(new Error(`Stripe failed to load: ${error}`));
    
    // Append script to document
    document.head.appendChild(script);
  });
};

/**
 * Create a payment method using card details
 * @param {Object} cardElement - Stripe card element
 * @param {Object} billingDetails - Customer billing details
 * @returns {Promise<Object>} Payment method object
 */
export const createPaymentMethod = async (cardElement, billingDetails) => {
  try {
    const stripe = await loadStripe();
    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails
    });
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.paymentMethod;
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
};

/**
 * Process a payment using the payment intent API
 * @param {string} paymentMethodId - ID of the payment method
 * @param {number} amount - Amount to charge in cents
 * @param {string} currency - Currency code (default: 'usd')
 * @returns {Promise<Object>} Payment result
 */
export const processPayment = async (paymentMethodId, amount, currency = 'usd') => {
  try {
    // In a real app, this would call your backend API to create a payment intent
    // For demo purposes, we'll simulate a successful payment
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful payment
    return {
      success: true,
      paymentId: `pi_${Math.random().toString(36).substring(2, 15)}`,
      amount,
      currency,
      status: 'succeeded',
      created: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

/**
 * Get saved payment methods for the current user
 * @returns {Promise<Array>} Array of saved payment methods
 */
export const getSavedPaymentMethods = async () => {
  try {
    // In a real app, this would call your backend API to fetch saved payment methods
    // For demo purposes, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [
      {
        id: 'pm_1234567890',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025
        },
        billing_details: {
          name: 'John Doe',
          email: 'john@example.com',
          address: {
            line1: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            postal_code: '94111',
            country: 'US'
          }
        },
        created: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

/**
 * Save a payment method for future use
 * @param {string} paymentMethodId - ID of the payment method to save
 * @returns {Promise<Object>} Saved payment method
 */
export const savePaymentMethod = async (paymentMethodId) => {
  try {
    // In a real app, this would call your backend API to save the payment method
    // For demo purposes, we'll simulate a successful save
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate successful save
    return {
      success: true,
      paymentMethod: {
        id: paymentMethodId,
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025
        },
        created: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error saving payment method:', error);
    throw error;
  }
};

/**
 * Get payment history for the current user
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} Array of payment records
 */
export const getPaymentHistory = async (limit = 10) => {
  try {
    // In a real app, this would call your backend API to fetch payment history
    // For demo purposes, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Generate mock payment history
    const mockPayments = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      id: `py_${Math.random().toString(36).substring(2, 10)}`,
      amount: Math.floor(Math.random() * 5000 + 1000) / 100,
      currency: 'usd',
      status: ['succeeded', 'succeeded', 'succeeded', 'failed', 'processing'][Math.floor(Math.random() * 5)],
      paymentMethod: 'Credit Card',
      orderId: `order_${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString() // Subtract days
    }));
    
    return mockPayments;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

// Export the service
const paymentService = {
  loadStripe,
  createPaymentMethod,
  processPayment,
  getSavedPaymentMethods,
  savePaymentMethod,
  getPaymentHistory
};

export default paymentService;
