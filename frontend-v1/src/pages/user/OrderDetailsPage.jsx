import React, { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiTruck, FiPackage, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';

const OrderDetailsPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // State for the selected order
  const [cancelling, setCancelling] = useState(false); // State for cancel button
  const userId = JSON.parse(localStorage.getItem('userData'))?.id; // Get user ID from localStorage

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/orders/user/${userId}`);
        setOrders(response.data || []);
      } catch (err) {
        console.error('Error fetching user orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserOrders();
    } else {
      setError('User not logged in.');
      setLoading(false);
    }
  }, [userId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'confirmed':
        return <FiCheckCircle className="text-blue-500" />;
      case 'preparing':
        return <FiPackage className="text-orange-500" />;
      case 'ready_for_pickup':
        return <FiTruck className="text-teal-500" />;
      case 'out_for_delivery':
        return <FiTruck className="text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      case 'refunded':
        return <FiRefreshCw className="text-gray-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const handleCancelOrder = async (orderId) => {
    setCancelling(true);
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, {
        status: 'CANCELLED',
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: 'CANCELLED' } : order
        )
      );
      setSelectedOrder((prevOrder) =>
        prevOrder ? { ...prevOrder, status: 'CANCELLED' } : null
      );
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel the order. Please try again.');
    } finally {
      setCancelling(false);
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
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-4">No Orders Found</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Order ID</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Total</th>
                <th className="py-3 px-6 text-center text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="py-3 px-6 text-sm text-gray-800">{order.id}</td>
                  <td className="py-3 px-6 text-sm text-gray-800">{formatDate(order.orderTime)}</td>
                  <td className="py-3 px-6 text-sm text-gray-800 flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status.replace(/_/g, ' ').toLowerCase()}</span>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-800">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-6 text-center text-sm text-orange-500">View Details</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog Box for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Order #{selectedOrder.id}</h2>
            <p className="text-gray-600 mb-4">Placed on: {formatDate(selectedOrder.orderTime)}</p>
            <h3 className="text-lg font-semibold mb-2">Items:</h3>
            <ul className="mb-4">
              {selectedOrder.orderItems.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.menuItemName || 'Item Name'}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 mb-4">
              <strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}
            </p>
            <div className="flex justify-end gap-4">
              {['pending', 'confirmed', 'preparing'].includes(selectedOrder.status.toLowerCase()) && (
                <button
                  className={`bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded ${
                    cancelling ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;