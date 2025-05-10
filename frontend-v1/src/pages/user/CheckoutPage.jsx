import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';  // Import axios
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const CheckoutPage = () => {
  const { items, restaurantId, restaurantName, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for the delivery address
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/user/cart');
      toast.error('Your cart is empty');
    }
  }, [items, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(value);

    // Clear field error when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // Handle checkout button click
  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      setFormErrors({ deliveryAddress: 'Delivery address is required' });
      return;
    }

    setLoading(true);

    // Prepare the order creation request body
    const orderItems = items.map((item) => ({
      menuItemId: item.id,
      quantity: item.quantity,
      customizations: item.customizations || '',
    }));

    const orderBody = {
      restaurantId: restaurantId,
      userId: user.id,
      deliveryAddress: deliveryAddress,
      specialInstructions: '', // If there's any additional instruction, you can include it here.
      items: orderItems,
      paymentMethod: 'CREDIT_CARD', // assuming CREDIT_CARD is selected
      totalAmount: total,
      status: 'CONFIRMED', // Initial status of the order
    };

    try {
      // Step 1: Create the Order
      const orderResponse = await axios.post('http://localhost:8080/api/orders/create', orderBody);
      const orderData = orderResponse.data;
      console.log('Order Response:', orderData); // Log the order response for debugging

      if (orderResponse.status === 201) {
        toast.success('Order created successfully!');

        // Step 2: Create the Payment session after the order is created
        const paymentBody = {
          amount: total, // total amount from the cart
          quantity: items.length, // total quantity of items
          currency: 'USD',
          name: 'food', // You can customize this as needed
        };

        // Make the API call to create the payment session
        const paymentResponse = await axios.post('http://localhost:8084/api/payments/checkout', paymentBody);
        const paymentData = paymentResponse.data;
        console.log('Payment Response:', paymentData); // Log the payment response for debugging

        if (paymentData.status === 'SUCCESS') {
          // Redirect to the payment session URL
          window.location.href = paymentData.sessionUrl;
        } else {
          toast.error('Failed to create payment session');
        }
      } else {
        toast.error('Failed to create order');
      }
    } catch (error) {
      toast.error('An error occurred while processing the order');
      console.error('Error:', error); // Log the error for debugging
    } finally {
      setLoading(false);
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

        {/* Delivery Address Section */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Delivery Details</h2>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-4">
              <Input
                id="deliveryAddress"
                name="deliveryAddress"
                label="Delivery Address"
                value={deliveryAddress}
                onChange={handleChange}
                required
                error={formErrors.deliveryAddress}
                disabled={loading}
              />
            </div>
          </div>

          {/* Checkout Button */}
          <div className="flex flex-col space-y-4 mt-6">
            <Button
              type="button"
              fullWidth
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Checkout - $${orderTotal.toFixed(2)}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
