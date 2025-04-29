import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../store/slices/orderSlice';
import { clearCart } from '../../store/slices/cartSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { items, restaurantId, restaurantName, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading, error, success, currentOrder } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for the checkout form
  const [formData, setFormData] = useState({
    deliveryAddress: user?.address || '',
    deliveryInstructions: '',
    paymentMethod: 'CREDIT_CARD',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    nameOnCard: '',
  });
  
  // State for form errors
  const [formErrors, setFormErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/user/cart');
      toast.error('Your cart is empty');
    }
  }, [items, navigate]);

  // Redirect on successful order
  useEffect(() => {
    if (success && currentOrder) {
      dispatch(clearCart());
      navigate(`/user/orders/${currentOrder.id}`);
    }
  }, [success, currentOrder, dispatch, navigate]);

  // Show error message if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear field error when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // Validate checkout form
  const validateForm = () => {
    const errors = {};

    if (!formData.deliveryAddress.trim()) {
      errors.deliveryAddress = 'Delivery address is required';
    }

    if (formData.paymentMethod === 'CREDIT_CARD') {
      // Simple credit card validation
      if (!formData.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Invalid card number';
      }

      if (!formData.cardExpiry.trim()) {
        errors.cardExpiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        errors.cardExpiry = 'Invalid expiry date format (MM/YY)';
      }

      if (!formData.cardCvv.trim()) {
        errors.cardCvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cardCvv)) {
        errors.cardCvv = 'Invalid CVV';
      }

      if (!formData.nameOnCard.trim()) {
        errors.nameOnCard = 'Name on card is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle place order
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Map cart items to order items format
      const orderItems = items.map((item) => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      // Calculate order totals
      const subtotal = total;
      const deliveryFee = 2.99;
      const tax = subtotal * 0.08; // 8% tax
      const totalAmount = subtotal + deliveryFee + tax;

      // Create order object
      const orderData = {
        restaurantId,
        restaurantName,
        deliveryAddress: formData.deliveryAddress,
        deliveryInstructions: formData.deliveryInstructions,
        paymentMethod: formData.paymentMethod,
        items: orderItems,
        subtotal,
        deliveryFee,
        tax,
        total: totalAmount,
        // Only include payment details in request if we're using a card
        // In a real app, you'd use a secure payment processor
        ...(formData.paymentMethod === 'CREDIT_CARD' && {
          paymentDetails: {
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
            cardExpiry: formData.cardExpiry,
            cardCvv: formData.cardCvv,
            nameOnCard: formData.nameOnCard,
          },
        }),
      };

      // Dispatch create order action
      dispatch(createOrder(orderData));
    }
  };

  // Calculate order summary
  const subtotal = total;
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08; // 8% tax
  const orderTotal = subtotal + deliveryFee + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden sticky top-6">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              <p className="mt-1 text-sm text-gray-500">
                {items.length} {items.length === 1 ? 'item' : 'items'} from {restaurantName}
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {/* Items summary */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.quantity} × {item.name}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cost breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="text-gray-900">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Delivery Fee</p>
                  <p className="text-gray-900">${deliveryFee.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Tax (8%)</p>
                  <p className="text-gray-900">${tax.toFixed(2)}</p>
                </div>
              </div>

              {/* Order total */}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">
                    ${orderTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout form */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Delivery details section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Delivery Details</h2>
              </div>
              <div className="px-4 py-5 sm:p-6 space-y-4">
                <Input
                  id="deliveryAddress"
                  name="deliveryAddress"
                  label="Delivery Address"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  required
                  error={formErrors.deliveryAddress}
                  disabled={loading}
                />

                <Input
                  id="deliveryInstructions"
                  name="deliveryInstructions"
                  label="Delivery Instructions (optional)"
                  value={formData.deliveryInstructions}
                  onChange={handleChange}
                  placeholder="E.g., Ring the doorbell, leave at door, etc."
                  disabled={loading}
                />
              </div>
            </div>

            {/* Payment details section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
              </div>
              <div className="px-4 py-5 sm:p-6 space-y-4">
                {/* Payment method selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Payment Method
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="paymentMethod-card"
                        name="paymentMethod"
                        type="radio"
                        value="CREDIT_CARD"
                        checked={formData.paymentMethod === 'CREDIT_CARD'}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300"
                      />
                      <label htmlFor="paymentMethod-card" className="ml-3 block text-sm text-gray-700">
                        Credit / Debit Card
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="paymentMethod-cash"
                        name="paymentMethod"
                        type="radio"
                        value="CASH_ON_DELIVERY"
                        checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300"
                      />
                      <label htmlFor="paymentMethod-cash" className="ml-3 block text-sm text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>

                {/* Credit card details - shown only if payment method is credit card */}
                {formData.paymentMethod === 'CREDIT_CARD' && (
                  <div className="space-y-4 pt-4">
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      label="Card Number"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      error={formErrors.cardNumber}
                      disabled={loading}
                    />

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                      <Input
                        id="nameOnCard"
                        name="nameOnCard"
                        label="Name on Card"
                        value={formData.nameOnCard}
                        onChange={handleChange}
                        required
                        error={formErrors.nameOnCard}
                        disabled={loading}
                      />

                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        label="Expiry Date (MM/YY)"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        required
                        error={formErrors.cardExpiry}
                        disabled={loading}
                      />

                      <Input
                        id="cardCvv"
                        name="cardCvv"
                        label="CVV"
                        value={formData.cardCvv}
                        onChange={handleChange}
                        placeholder="123"
                        required
                        error={formErrors.cardCvv}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit button */}
            <div className="flex flex-col space-y-4">
              <Button
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order - $${orderTotal.toFixed(2)}`
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate('/user/cart')}
                disabled={loading}
              >
                Back to Cart
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;