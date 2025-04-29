import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchOrder, 
  selectCurrentOrder, 
  selectOrderLoading, 
  selectOrderError 
} from '../../store/slices/orderSlice';

const OrderConfirmation = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // Use Redux state
  const order = useSelector(selectCurrentOrder);
  const isLoading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  useEffect(() => {
    // Fetch order details when component mounts
    dispatch(fetchOrder(id));
  }, [id, dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white bg-opacity-5 rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-gray-400 mb-2">Thank you for your order. We've received your order and will begin processing it right away.</p>
            <p className="text-gray-400">You'll receive updates about your order status via email.</p>
          </div>
          
          <div className="border-t border-b border-gray-700 py-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-300">Order Number:</span>
              <span className="text-white">{order.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-300">Order Date:</span>
              <span className="text-white">{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-300">Status:</span>
              <span className="capitalize text-white">{order.status?.toLowerCase().replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-300">Restaurant:</span>
              <span className="text-white">{order.restaurantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-300">Delivery Address:</span>
              <span className="text-right text-white">{order.deliveryAddress}</span>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4 text-white">Order Items</h2>
          <div className="mb-6">
            {order.items?.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b border-gray-700">
                <div className="text-white">
                  <span className="font-medium">{item.quantity}x</span> {item.name}
                </div>
                <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="flex justify-between mt-4 pt-2">
              <span className="font-bold text-white">Total:</span>
              <span className="font-bold text-indigo-400">${order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              to="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
