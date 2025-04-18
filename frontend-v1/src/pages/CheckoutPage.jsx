import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight, FiCreditCard, FiMapPin, FiClock, FiCheckCircle } from 'react-icons/fi';
import { clearCart } from '../store/slices/cartSlice';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, restaurantName, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  const [activeStep, setActiveStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: user?.address || '',
    apartment: '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    phoneNumber: user?.phone || '',
    deliveryNotes: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    savePaymentMethod: false,
  });
  
  // Calculate delivery fee and taxes
  const subtotal = total;
  const deliveryFee = 3.99;
  const tax = subtotal * 0.08; // Assuming 8% tax rate
  const orderTotal = subtotal + deliveryFee + tax;
  
  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo({
      ...deliveryInfo,
      [name]: value,
    });
  };
  
  const handlePaymentInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const isDeliveryInfoValid = () => {
    const { address, city, postalCode, phoneNumber } = deliveryInfo;
    return address.trim() && city.trim() && postalCode.trim() && phoneNumber.trim();
  };
  
  const isPaymentInfoValid = () => {
    const { cardNumber, cardName, expiryDate, cvv } = paymentInfo;
    // Simple validation - in a real app you'd want to use a library for credit card validation
    return (
      cardNumber.trim().length >= 16 &&
      cardName.trim() &&
      expiryDate.trim().length >= 5 &&
      cvv.trim().length >= 3
    );
  };
  
  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (isDeliveryInfoValid()) {
      setActiveStep(2);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (isPaymentInfoValid()) {
      // Here you would typically send the order to your API
      // For this example, we'll just simulate a successful order
      setOrderPlaced(true);
      dispatch(clearCart());
      window.scrollTo(0, 0);
    }
  };
  
  if (orderPlaced) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                  <FiCheckCircle className="text-green-500" size={48} />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-4">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-8">
                Your order has been placed and will be delivered soon. You can track your order in the "My Orders" section.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/orders')}>
                  Track My Order
                </Button>
                <Button variant="outline" onClick={() => navigate('/restaurants')}>
                  Order More Food
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-rowdies font-bold mb-8">Checkout</h1>
          
          {/* Checkout Steps */}
          <div className="flex mb-8">
            <div className={`flex-1 text-center relative ${activeStep >= 1 ? 'text-orange-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${activeStep >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className="mt-2">Delivery</div>
              {activeStep > 1 && <div className="absolute top-4 left-1/2 w-full h-0.5 bg-orange-500"></div>}
            </div>
            <div className={`flex-1 text-center relative ${activeStep >= 2 ? 'text-orange-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${activeStep >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className="mt-2">Payment</div>
              {activeStep > 2 && <div className="absolute top-4 left-1/2 w-full h-0.5 bg-orange-500"></div>}
            </div>
            <div className={`flex-1 text-center ${activeStep >= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${activeStep >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
              <div className="mt-2">Confirm</div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Delivery Form */}
            {activeStep === 1 && (
              <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-6">
                    <FiMapPin className="text-orange-500 mr-3" size={24} />
                    <h2 className="text-xl font-semibold">Delivery Information</h2>
                  </div>
                  
                  <form onSubmit={handleContinueToPayment}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-2">
                          Street Address*
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={deliveryInfo.address}
                          onChange={handleDeliveryInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="apartment" className="block text-gray-700 text-sm font-medium mb-2">
                          Apartment, Suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          id="apartment"
                          name="apartment"
                          value={deliveryInfo.apartment}
                          onChange={handleDeliveryInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2">
                          City*
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={deliveryInfo.city}
                          onChange={handleDeliveryInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="postalCode" className="block text-gray-700 text-sm font-medium mb-2">
                          Postal Code*
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={deliveryInfo.postalCode}
                          onChange={handleDeliveryInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-medium mb-2">
                          Phone Number*
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={deliveryInfo.phoneNumber}
                          onChange={handleDeliveryInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="deliveryNotes" className="block text-gray-700 text-sm font-medium mb-2">
                          Delivery Notes (optional)
                        </label>
                        <textarea
                          id="deliveryNotes"
                          name="deliveryNotes"
                          value={deliveryInfo.deliveryNotes}
                          onChange={handleDeliveryInfoChange}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Add any special instructions for delivery"
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button type="submit" size="lg">
                        Continue to Payment <FiChevronRight className="ml-2" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Payment Form */}
            {activeStep === 2 && (
              <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-6">
                    <FiCreditCard className="text-orange-500 mr-3" size={24} />
                    <h2 className="text-xl font-semibold">Payment Method</h2>
                  </div>
                  
                  <form onSubmit={handlePlaceOrder}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-medium mb-2">
                          Card Number*
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="cardName" className="block text-gray-700 text-sm font-medium mb-2">
                          Name on Card*
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={paymentInfo.cardName}
                          onChange={handlePaymentInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-medium mb-2">
                          Expiry Date*
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-gray-700 text-sm font-medium mb-2">
                          CVV*
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="savePaymentMethod"
                            name="savePaymentMethod"
                            checked={paymentInfo.savePaymentMethod}
                            onChange={handlePaymentInfoChange}
                            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <label htmlFor="savePaymentMethod" className="ml-2 block text-gray-700 text-sm">
                            Save this payment method for future orders
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Back to Delivery
                      </button>
                      <Button type="submit" size="lg">
                        Place Order <FiChevronRight className="ml-2" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="mb-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <FiClock className="mr-2" />
                    <span>Estimated Delivery: 30-45 min</span>
                  </div>
                  <div className="font-medium">{restaurantName}</div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity}x </span>
                        <span>{item.name}</span>
                      </div>
                      <div>${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2">
                    <span>Total</span>
                    <span className="text-orange-600">${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;