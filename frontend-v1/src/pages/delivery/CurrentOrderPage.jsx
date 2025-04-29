import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiUser, FiPhone, FiPackage, FiClock, FiCheck, FiX, FiMessageSquare, FiNavigation } from 'react-icons/fi';

const CurrentOrderPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const fetchCurrentOrder = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would call your API
        // const response = await deliveryService.getCurrentOrder();
        
        // Mock data for development
        setTimeout(() => {
          const mockOrder = {
            id: 'ORD-8123',
            restaurantName: 'Burger King',
            restaurantAddress: '789 Main St',
            restaurantPhone: '(555) 123-4567',
            restaurantId: 'rest-123',
            customerName: 'John Smith',
            customerAddress: '456 Pine St, Apt 3C',
            customerPhone: '(555) 987-6543',
            customerInstructions: 'Please leave at the door. Building code is #4321.',
            items: [
              { name: 'Whopper', quantity: 2 },
              { name: 'French Fries (Large)', quantity: 1 },
              { name: 'Coca Cola', quantity: 2 }
            ],
            total: 28.97,
            distance: 2.3,
            estimatedTime: 15,
            estimatedEarnings: 8.50,
            placedAt: new Date(Date.now() - 8 * 60000),
            status: 'picked_up',
            timeline: [
              { status: 'accepted', timestamp: new Date(Date.now() - 10 * 60000) },
              { status: 'arrived_at_restaurant', timestamp: new Date(Date.now() - 5 * 60000) },
              { status: 'picked_up', timestamp: new Date(Date.now() - 3 * 60000) }
            ]
          };
          
          setCurrentOrder(mockOrder);
          setOrderStatus(mockOrder.status);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching current order:', error);
        setLoading(false);
      }
    };

    fetchCurrentOrder();
  }, []);

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'accepted': 'arrived_at_restaurant',
      'arrived_at_restaurant': 'picked_up',
      'picked_up': 'arrived_at_customer',
      'arrived_at_customer': 'delivered'
    };
    
    return statusFlow[currentStatus] || '';
  };

  const handleUpdateStatus = async () => {
    const nextStatus = getNextStatus(orderStatus);
    
    if (!nextStatus) {
      console.error('No next status found');
      return;
    }
    
    setIsUpdatingStatus(true);
    
    try {
      // In a real app, you would call your API
      // await deliveryService.updateOrderStatus(currentOrder.id, nextStatus);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setOrderStatus(nextStatus);
      setCurrentOrder({
        ...currentOrder,
        status: nextStatus,
        timeline: [
          ...currentOrder.timeline,
          { status: nextStatus, timestamp: new Date() }
        ]
      });
      
      // If the order is delivered, show the confirmation modal
      if (nextStatus === 'delivered') {
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCompleteDelivery = () => {
    // In a real app, you might want to do some final API calls or cleanup
    navigate('/delivery/dashboard');
  };

  const handleCancelDelivery = () => {
    if (window.confirm('Are you sure you want to cancel this delivery? This action cannot be undone.')) {
      // In a real app, you would call your API
      // await deliveryService.cancelDelivery(currentOrder.id);
      navigate('/delivery/dashboard');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'accepted': 'Accepted',
      'arrived_at_restaurant': 'Arrived at Restaurant',
      'picked_up': 'Picked Up',
      'arrived_at_customer': 'Arrived at Customer',
      'delivered': 'Delivered'
    };
    
    return statusLabels[status] || status;
  };

  const getNextActionLabel = (currentStatus) => {
    const actionLabels = {
      'accepted': 'Arrived at Restaurant',
      'arrived_at_restaurant': 'Picked Up Order',
      'picked_up': 'Arrived at Customer',
      'arrived_at_customer': 'Delivered Order'
    };
    
    return actionLabels[currentStatus] || '';
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    
    // In a real app, you would call your API
    // await deliveryService.sendMessage(currentOrder.id, messageText);
    
    alert('Message sent!');
    setMessageText('');
    setContactModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <FiPackage size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Delivery</h3>
          <p className="text-gray-600 mb-4">
            You don't have any active deliveries at the moment.
          </p>
          <button
            onClick={() => navigate('/delivery/available-orders')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Find Available Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Current Delivery</h1>
        <p className="text-gray-600">Order #{currentOrder.id}</p>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Delivery Progress</h2>
        </div>
        <div className="px-6 py-4">
          <ol className="relative border-l border-gray-200 ml-3">
            {currentOrder.timeline.map((event, index) => (
              <li key={index} className="mb-6 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                  <FiCheck className="w-3 h-3 text-green-600" />
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                  {getStatusLabel(event.status)}
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                  {formatDateTime(event.timestamp)}
                </time>
              </li>
            ))}
            
            {orderStatus !== 'delivered' && (
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -left-3 ring-8 ring-white">
                  <FiClock className="w-3 h-3 text-gray-500" />
                </span>
                <h3 className="flex items-center mb-1 text-lg font-normal text-gray-500">
                  {getStatusLabel(getNextStatus(orderStatus))}
                </h3>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdatingStatus}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    `Mark as ${getNextActionLabel(orderStatus)}`
                  )}
                </button>
              </li>
            )}
          </ol>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Restaurant */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Restaurant</h2>
          </div>
          <div className="px-6 py-4">
            <h3 className="font-medium text-gray-900">{currentOrder.restaurantName}</h3>
            <div className="flex items-start text-sm text-gray-500 mt-2">
              <FiMapPin className="mt-0.5 mr-2 flex-shrink-0" size={16} />
              <span>{currentOrder.restaurantAddress}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <FiPhone className="mr-2 flex-shrink-0" size={16} />
              <span>{currentOrder.restaurantPhone}</span>
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(currentOrder.restaurantAddress)}`, '_blank')}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <FiNavigation className="mr-2" />
                Navigate to Restaurant
              </button>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Customer</h2>
          </div>
          <div className="px-6 py-4">
            <h3 className="font-medium text-gray-900">{currentOrder.customerName}</h3>
            <div className="flex items-start text-sm text-gray-500 mt-2">
              <FiMapPin className="mt-0.5 mr-2 flex-shrink-0" size={16} />
              <span>{currentOrder.customerAddress}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <FiPhone className="mr-2 flex-shrink-0" size={16} />
              <span>{currentOrder.customerPhone}</span>
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(currentOrder.customerAddress)}`, '_blank')}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <FiNavigation className="mr-2" />
                Navigate to Customer
              </button>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
          </div>
          <div className="px-6 py-4">
            <ul className="divide-y divide-gray-200">
              {currentOrder.items.map((item, index) => (
                <li key={index} className="py-2 flex justify-between">
                  <span className="text-sm text-gray-700">{item.quantity}x {item.name}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(currentOrder.total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Your earnings:</span>
                <span>{formatCurrency(currentOrder.estimatedEarnings)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Instructions */}
      {currentOrder.customerInstructions && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Delivery Instructions</h2>
          </div>
          <div className="px-6 py-4">
            <p className="text-gray-700">{currentOrder.customerInstructions}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setContactModalOpen(true)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiMessageSquare className="mr-2" />
          Contact Customer
        </button>
        {orderStatus !== 'delivered' && (
          <button
            onClick={handleCancelDelivery}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FiX className="mr-2" />
            Cancel Delivery
          </button>
        )}
      </div>

      {/* Delivery Complete Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delivery Completed
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You have successfully delivered order #{currentOrder.id}. Your earnings for this delivery ({formatCurrency(currentOrder.estimatedEarnings)}) will be added to your account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCompleteDelivery}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Contact Customer
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Send a message to {currentOrder.customerName} about their delivery.
                      </p>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        placeholder="Type your message here..."
                      ></textarea>
                      <div className="mt-4 flex space-x-4">
                        <button
                          type="button"
                          onClick={() => window.location.href = `tel:${currentOrder.customerPhone.replace(/[^0-9]/g, '')}`}
                          className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          <FiPhone className="mr-2" />
                          Call Customer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={sendMessage}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentOrderPage;