import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiMapPin, FiPhone, FiUser, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { order as orderService } from '../../services/api';
import Button from '../../components/common/Button';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
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

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Processing';
    
    // Convert from ENUM_STYLE to Display Style
    return status.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const getStatusColorClass = (status) => {
    if (!status) return 'text-yellow-600 bg-yellow-100';
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'preparing':
      case 'ready_for_pickup':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => navigate('/user/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  // If order data isn't available, create placeholder data
  const orderData = order || {
    id: id,
    status: 'PROCESSING',
    createdAt: new Date().toISOString(),
    restaurantName: 'Restaurant Name',
    items: [
      { id: 1, name: 'Sample Item 1', price: 9.99, quantity: 1 },
      { id: 2, name: 'Sample Item 2', price: 12.99, quantity: 2 }
    ],
    subtotal: 35.97,
    deliveryFee: 3.99,
    tax: 2.88,
    total: 42.84,
    deliveryAddress: '123 Sample Street, Sample City',
    customerName: 'John Doe',
    customerPhone: '(123) 456-7890',
    paymentMethod: 'Credit Card'
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/user/orders')} className="mr-4 text-gray-600 hover:text-gray-900">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
        {/* Order Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Order #{orderData.id}
              </h2>
              <p className="text-gray-600">
                Placed on {formatDate(orderData.createdAt)}
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColorClass(orderData.status)}`}>
                {getStatusLabel(orderData.status)}
              </span>
            </div>
          </div>
          <p className="text-gray-800 font-medium">
            {orderData.restaurantName}
          </p>
        </div>

        {/* Order Items */}
        <div className="p-6 border-b border-gray-200">
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

        {/* Order Summary */}
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800">${orderData.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-gray-800">${orderData.deliveryFee?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-800">${orderData.tax?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
              <span className="text-gray-900 font-semibold">Total</span>
              <span className="text-gray-900 font-semibold">${orderData.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Info */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Delivery Information</h3>
            <p className="text-gray-800 flex items-center mb-2">
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

      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        {orderData.status !== 'DELIVERED' && orderData.status !== 'CANCELLED' && (
          <Link to={`/user/orders/${orderData.id}/tracking`}>
            <Button>Track Order</Button>
          </Link>
        )}
        <Link to="/user/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailsPage;