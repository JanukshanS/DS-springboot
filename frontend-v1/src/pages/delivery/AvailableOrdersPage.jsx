import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiPackage, FiMapPin, FiDollarSign, FiClock, FiUser, FiInfo, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AvailableOrdersPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    const fetchAvailableOrders = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would call your API
        // const response = await deliveryService.getAvailableOrders();
        
        // Mock data for development
        setTimeout(() => {
          const mockAvailableOrders = [
            {
              id: 'ORD-8123',
              restaurantName: 'Burger King',
              restaurantAddress: '789 Main St',
              restaurantId: 'rest-123',
              customerName: 'John Smith',
              customerAddress: '456 Pine St, Apt 3C',
              items: [
                { name: 'Whopper', quantity: 2 },
                { name: 'French Fries (Large)', quantity: 1 },
                { name: 'Coca Cola', quantity: 2 }
              ],
              total: 28.97,
              distance: 2.3,
              estimatedTime: 15,
              estimatedEarnings: 8.50,
              placedAt: new Date(Date.now() - 8 * 60000)
            },
            {
              id: 'ORD-8125',
              restaurantName: 'Pizza Hut',
              restaurantAddress: '123 Oak Ave',
              restaurantId: 'rest-456',
              customerName: 'Emma Johnson',
              customerAddress: '789 Maple Dr, Suite 10',
              items: [
                { name: 'Pepperoni Pizza (Large)', quantity: 1 },
                { name: 'Garlic Bread', quantity: 1 },
                { name: 'Wings (8 pcs)', quantity: 1 }
              ],
              total: 32.95,
              distance: 3.7,
              estimatedTime: 20,
              estimatedEarnings: 9.75,
              placedAt: new Date(Date.now() - 12 * 60000)
            },
            {
              id: 'ORD-8129',
              restaurantName: 'Chipotle',
              restaurantAddress: '456 Elm St',
              restaurantId: 'rest-789',
              customerName: 'Michael Brown',
              customerAddress: '234 Cedar Ln',
              items: [
                { name: 'Burrito Bowl', quantity: 2 },
                { name: 'Chips & Guacamole', quantity: 1 },
                { name: 'Soda', quantity: 2 }
              ],
              total: 35.87,
              distance: 1.8,
              estimatedTime: 10,
              estimatedEarnings: 7.25,
              placedAt: new Date(Date.now() - 15 * 60000)
            }
          ];
          
          setAvailableOrders(mockAvailableOrders);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching available orders:', error);
        setLoading(false);
      }
    };

    fetchAvailableOrders();

    // In a real app, you might want to set up a polling interval or websocket
    // to periodically check for new available orders
    const interval = setInterval(fetchAvailableOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAcceptOrder = async (orderId) => {
    setIsAccepting(true);
    
    try {
      // In a real app, you would call your API
      // await deliveryService.acceptOrder(orderId);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to the current order page
      navigate('/delivery/current-order');
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('Failed to accept order. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTimeAgo = (date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    return `${minutes} min ago`;
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Orders</h1>
          <p className="text-gray-600">Orders available for delivery in your area</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              viewMode === 'list'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              viewMode === 'map'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableOrders.length > 0 ? (
            availableOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{order.restaurantName}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiMapPin size={12} className="mr-1" />
                        <span>{order.restaurantAddress}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        {formatTimeAgo(order.placedAt)}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{order.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <FiUser size={14} className="mr-2" />
                    <span className="font-medium">Deliver to: </span>
                    <span className="ml-1">{order.customerName}</span>
                  </div>
                  
                  <div className="flex items-start text-sm text-gray-600 mb-3">
                    <FiMapPin size={14} className="mr-2 mt-1" />
                    <span>{order.customerAddress}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center text-gray-700">
                        <FiDollarSign size={14} className="mr-1" />
                        <span className="font-medium">{formatCurrency(order.estimatedEarnings)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Earnings</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center text-gray-700">
                        <FiClock size={14} className="mr-1" />
                        <span className="font-medium">{order.estimatedTime} min</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Est. Time</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center text-gray-700">
                        <span className="font-medium">{order.distance} mi</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Distance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => handleViewOrderDetails(order)}
                      className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
                    >
                      <FiInfo size={14} className="mr-1" />
                      Details
                    </button>
                    
                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      disabled={isAccepting}
                      className="px-4 py-1.5 text-sm font-medium rounded-md bg-orange-600 text-white hover:bg-orange-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAccepting ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Accepting...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <FiCheck size={14} className="mr-1" />
                          Accept Order
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <FiPackage size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Available Orders</h3>
              <p className="text-gray-600">
                There are no orders available for delivery at the moment.
                <br />Check back soon!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center h-96">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <FiMapPin size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Map View Coming Soon</h3>
          <p className="text-gray-600">
            We're working on a map view to help you see orders by location.
            <br />Please use the list view for now.
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Order Details
                    </h3>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{selectedOrder.restaurantName}</h4>
                          <p className="text-sm text-gray-500">{selectedOrder.restaurantAddress}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-500">{selectedOrder.id}</span>
                      </div>
                      
                      <div className="border-t border-b border-gray-200 py-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                        <ul className="space-y-2">
                          {selectedOrder.items.map((item, index) => (
                            <li key={index} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <FiUser size={14} className="mr-2 mt-1" />
                            <div>
                              <p className="text-gray-700">{selectedOrder.customerName}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <FiMapPin size={14} className="mr-2 mt-1" />
                            <div>
                              <p className="text-gray-700">{selectedOrder.customerAddress}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Order Total:</span>
                          <span className="font-medium">{formatCurrency(selectedOrder.total)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Estimated Earnings:</span>
                          <span className="font-medium">{formatCurrency(selectedOrder.estimatedEarnings)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Distance:</span>
                          <span className="font-medium">{selectedOrder.distance} miles</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Estimated Time:</span>
                          <span className="font-medium">{selectedOrder.estimatedTime} minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleAcceptOrder(selectedOrder.id)}
                  disabled={isAccepting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAccepting ? 'Accepting...' : 'Accept Order'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseDetails}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableOrdersPage;