import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { orderService, paymentService, authService } from '../../services/api';
import {
  selectCartItems,
  selectCartTotalAmount,
  selectRestaurant,
  clearCart
} from '../../store/slices/cartSlice';
import {
  createOrder,
  selectOrderLoading,
  selectOrderError,
  clearOrderError,
  setOrderError
} from '../../store/slices/orderSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMounted = useRef(true);

  // Use Redux state
  const cartItems = useSelector(selectCartItems);
  const restaurant = useSelector(selectRestaurant);
  const cartTotal = useSelector(selectCartTotalAmount);
  const isLoading = useSelector(selectOrderLoading);
  const orderError = useSelector(selectOrderError);

  // Form state still managed locally
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    specialInstructions: '',
    paymentMethod: 'card',
  });

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    // Set up the cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Clear previous order errors
    dispatch(clearOrderError());

    // Only proceed with navigation if the component is still mounted
    if (!isMounted.current) return;

    // Handle redirects only on initial mount and significant cart/auth changes
    const handleInitialRedirects = () => {
      // Redirect to login if not authenticated
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Redirect to home if cart is empty
      if (cartItems.length === 0 || !restaurant) {
        navigate('/');
        return;
      }
    };

    handleInitialRedirects();

    // Pre-fill address from user profile
    if (isMounted.current && currentUser?.address) {
      setFormData(prevState => ({
        ...prevState,
        deliveryAddress: currentUser.address || '',
      }));
    }
  }, [navigate, currentUser, cartItems, restaurant, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateSubtotal = () => {
    return cartTotal;
  };

  const calculateDeliveryFee = () => {
    return restaurant?.deliveryFee || 2.99;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateDeliveryFee();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearOrderError());

    try {
      // Create order items from cart
      const orderItems = cartItems.map(item => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        specialInstructions: '',
      }));

      // Create order request
      const orderRequest = {
        userId: currentUser.id,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        items: orderItems,
        deliveryAddress: formData.deliveryAddress,
        customerPhone: currentUser.phoneNumber || '',
        customerName: currentUser.name,
        specialInstructions: formData.specialInstructions,
        totalAmount: calculateTotal(),
        paymentMethod: formData.paymentMethod,
      };

      // Dispatch create order action
      const resultAction = await dispatch(createOrder(orderRequest));

      if (createOrder.fulfilled.match(resultAction)) {
        const orderId = resultAction.payload.id;

        // Process payment
        if (formData.paymentMethod === 'card') {
          try {
            const paymentRequest = {
              orderId: orderId,
              amount: calculateTotal(),
              currency: 'USD',
            };

            await paymentService.createPaymentIntent(paymentRequest);
          } catch (paymentError) {
            console.error('Payment processing error:', paymentError);
            dispatch(setOrderError('Payment processing failed. Please try again or use a different payment method.'));
            return;
          }
        }

        // Clear cart
        dispatch(clearCart());

        // Redirect to order confirmation
        navigate(`/orders/${orderId}/confirmation`);
      } else if (createOrder.rejected.match(resultAction)) {
        const errorMessage = resultAction.error.message || 'Failed to create order';
        dispatch(setOrderError(errorMessage));
      }
    } catch (err) {
      console.error('Error processing order:', err);
      dispatch(setOrderError(err.message || 'An unexpected error occurred. Please try again.'));
    }
  };

  if (cartItems.length === 0 || !restaurant) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">No items in cart.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {orderError && (
        <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-400 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <span className="block sm:inline">{orderError}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white bg-opacity-5 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
              <div className="mb-4">
                <label htmlFor="deliveryAddress" className="block text-white font-medium mb-2">Delivery Address</label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  rows="3"
                  required
                  className="w-full px-3 py-2 bg-white bg-opacity-10 border border-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                  placeholder="Enter your full delivery address"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  disabled={isLoading}
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="specialInstructions" className="block text-white font-medium mb-2">Special Instructions (Optional)</label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  rows="2"
                  className="w-full px-3 py-2 bg-white bg-opacity-10 border border-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
                  placeholder="Any special instructions for delivery or food preparation"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  disabled={isLoading}
                ></textarea>
              </div>
            </div>

            <div className="bg-white bg-opacity-5 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="card"
                    name="paymentMethod"
                    type="radio"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    disabled={isLoading}
                  />
                  <label htmlFor="card" className="ml-3 block text-white">
                    Credit/Debit Card
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="cash"
                    name="paymentMethod"
                    type="radio"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    disabled={isLoading}
                  />
                  <label htmlFor="cash" className="ml-3 block text-white">
                    Cash on Delivery
                  </label>
                </div>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="mt-4 p-4 border border-gray-700 rounded-md bg-gray-800 bg-opacity-50">
                  <p className="text-gray-300 text-sm">
                    In a real application, a Stripe payment form would be integrated here.
                    For this demo, we'll simulate a successful payment.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white bg-opacity-5 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Delivery Fee</span>
                  <span className="text-white">${calculateDeliveryFee().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tax (10%)</span>
                  <span className="text-white">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 my-2"></div>
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Place Order'
              )}
            </button>
          </form>
        </div>

        <div className="md:w-1/3">
          <div className="bg-white bg-opacity-5 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-white">{item.name}</p>
                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
