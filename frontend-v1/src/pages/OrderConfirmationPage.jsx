import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiMapPin, FiPhone, FiUser, FiFileText, FiTruck } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { orderService } from '../services/api';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderService.getById(id);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format estimated delivery time
  const getEstimatedDelivery = (order) => {
    if (!order || !order.createdAt) return 'Calculating...';
    
    // Add 30-45 minutes to order creation time
    const orderDate = new Date(order.createdAt);
    const minDelivery = new Date(orderDate.getTime() + 30 * 60000);
    const maxDelivery = new Date(orderDate.getTime() + 45 * 60000);
    
    const options = { hour: '2-digit', minute: '2-digit' };
    return `${minDelivery.toLocaleTimeString(undefined, options)} - ${maxDelivery.toLocaleTimeString(undefined, options)}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
          <div className="mt-6 text-center">
            <Link to="/orders">
              <Button>View All Orders</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // If no order data is available, create a mock order for demonstration
  const mockOrder = {
    id: id || '12345',
    status: 'processing',
    createdAt: new Date().toISOString(),
    restaurantName: 'Delicious Restaurant',
    items: [
      { id: 1, name: 'Burger', quantity: 2, price: 9.99 },
      { id: 2, name: 'Fries', quantity: 1, price: 3.99 },
      { id: 3, name: 'Soda', quantity: 2, price: 1.99 }
    ],
    subtotal: 27.95,
    deliveryFee: 2.99,
    tax: 2.50,
    totalAmount: 33.44,
    paymentMethod: 'Credit Card',
    deliveryAddress: '123 Main St, Anytown, USA',
    customerName: 'John Doe',
    customerPhone: '(123) 456-7890'
  };

  const orderData = order || mockOrder;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 bg-green-500 text-white">
              <div className="flex items-center justify-center">
                <FiCheckCircle className="text-4xl mr-3" />
                <h1 className="text-2xl font-rowdies font-bold">Order Confirmed!</h1>
              </div>
              <p className="text-center mt-2">
                Your order #{orderData.id} has been received and is being processed.
              </p>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between mb-8">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1">Order Date</h2>
                  <p className="text-gray-800 flex items-center">
                    <FiClock className="mr-2 text-gray-400" />
                    {formatDate(orderData.createdAt)}
                  </p>
                </div>
                
                <div className="mb-4 md:mb-0">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1">Estimated Delivery</h2>
                  <p className="text-gray-800 flex items-center">
                    <FiTruck className="mr-2 text-gray-400" />
                    {getEstimatedDelivery(orderData)}
                  </p>
                </div>
                
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1">Order Status</h2>
                  <p className="text-gray-800 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="capitalize">{orderData.status || 'Processing'}</span>
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Details</h2>
                
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Items</h3>
                  <div className="space-y-3">
                    {orderData.items.map((item, index) => (
                      <div key={item.id || index} className="flex justify-between">
                        <div>
                          <span className="text-gray-800">{item.quantity}x </span>
                          <span className="text-gray-800">{item.name}</span>
                        </div>
                        <span className="text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800">${orderData.subtotal?.toFixed(2) || '27.95'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-800">${orderData.deliveryFee?.toFixed(2) || '2.99'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-800">${orderData.tax?.toFixed(2) || '2.50'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <span>Total</span>
                    <span>${orderData.totalAmount?.toFixed(2) || '33.44'}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Delivery Information</h3>
                  <p className="text-gray-800 flex items-start mb-2">
                    <FiMapPin className="mr-2 text-gray-400 mt-1" />
                    <span>{orderData.deliveryAddress}</span>
                  </p>
                  <p className="text-gray-800 flex items-center mb-2">
                    <FiUser className="mr-2 text-gray-400" />
                    <span>{orderData.customerName}</span>
                  </p>
                  <p className="text-gray-800 flex items-center">
                    <FiPhone className="mr-2 text-gray-400" />
                    <span>{orderData.customerPhone}</span>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Payment Information</h3>
                  <p className="text-gray-800 flex items-center mb-2">
                    <FiFileText className="mr-2 text-gray-400" />
                    <span>Payment Method: {orderData.paymentMethod}</span>
                  </p>
                  <p className="text-gray-800 flex items-center">
                    <FiCheckCircle className="mr-2 text-gray-400" />
                    <span>Payment Status: Paid</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to={`/orders/${orderData.id}/tracking`}>
              <Button>Track Order</Button>
            </Link>
            <Link to="/orders">
              <Button variant="outline">View All Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage;
