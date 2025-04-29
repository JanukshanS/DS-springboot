import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiPackage, FiCreditCard, FiTruck, FiCheckCircle, FiXCircle, FiLoader, FiClock, FiArrowRight } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import { order, payment } from '../services/api';

const OrderHistoryPage = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch orders
        const ordersResponse = await order.getUserOrders();
        setOrders(ordersResponse.data || []);

        // Fetch payment history
        const paymentsResponse = await payment.getHistory();
        setPayments(paymentsResponse.data || []);
      } catch (err) {
        console.error('Error fetching user activity:', err);
        setError('Failed to load your activity. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    if (!status) return <FiClock className="text-gray-500" />;
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
      case 'paid':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
      case 'failed':
        return <FiXCircle className="text-red-500" />;
      case 'processing':
      case 'preparing':
      case 'in_transit':
        return <FiLoader className="text-yellow-500 animate-spin" />;
      case 'ready_for_pickup':
        return <FiPackage className="text-blue-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-rowdies font-bold text-gray-800 mb-8">Your Activity</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'orders'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <div className="flex items-center">
              <FiPackage className="mr-2" />
              Orders
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'payments'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('payments')}
          >
            <div className="flex items-center">
              <FiCreditCard className="mr-2" />
              Payments
            </div>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <h2 className="text-xl font-bold mb-4">No Orders Yet</h2>
                <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                <Link
                  to="/restaurants"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Browse Restaurants
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{order.restaurantName}</h3>
                          <p className="text-gray-500 text-sm">
                            Order #{order.id} • {formatDate(order.createdAt || new Date())}
                          </p>
                        </div>
                        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                          {getStatusIcon(order.status)}
                          <span className="ml-2 text-sm font-medium capitalize">
                            {order.status ? order.status.toLowerCase().replace('_', ' ') : 'Processing'}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2 text-gray-700">Items:</h4>
                        <div className="space-y-2">
                          {(order.items || []).map((item, index) => (
                            <div key={item.id || index} className="flex justify-between">
                              <div>
                                <span className="text-gray-500">{item.quantity}x </span>
                                {item.name}
                              </div>
                              <span>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between border-t border-gray-100 pt-4">
                        <div className="text-gray-500">
                          <div className="flex items-center">
                            <FiTruck className="mr-2" />
                            {order.deliveryAddress || 'Delivery address'}
                          </div>
                        </div>
                        <div className="font-bold text-gray-800">
                          Total: ${(order.totalAmount || 0).toFixed(2)}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Link
                          to={`/orders/${order.id}/tracking`}
                          className="text-orange-500 hover:text-orange-600 flex items-center"
                        >
                          Track Order
                          <FiArrowRight className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div>
            {payments.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <h2 className="text-xl font-bold mb-4">No Payment History</h2>
                <p className="text-gray-600">You don't have any payment records yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-md">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map(payment => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.createdAt || new Date())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/orders/${payment.orderId}/tracking`}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            #{payment.orderId}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          ${(payment.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {payment.paymentMethod ? payment.paymentMethod.toLowerCase().replace('_', ' ') : 'Credit Card'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            {getStatusIcon(payment.status)}
                            <span className="ml-2 capitalize">
                              {payment.status ? payment.status.toLowerCase().replace('_', ' ') : 'Processed'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderHistoryPage;
