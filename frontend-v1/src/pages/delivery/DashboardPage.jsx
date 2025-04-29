import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiPackage, FiClock, FiTruck, FiDollarSign, FiCalendar, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedToday: 0,
    averageTime: 0,
    totalEarnings: 0,
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would call your API
        // const statsResponse = await deliveryService.getDeliveryStats();
        // const recentResponse = await deliveryService.getRecentDeliveries();
        
        // Mock data for development
        setTimeout(() => {
          const mockStats = {
            totalDeliveries: 142,
            completedToday: 5,
            averageTime: 22,
            totalEarnings: 1258.75,
          };
          
          const mockRecentDeliveries = [
            {
              id: 'ORD-7869',
              restaurantName: 'Pizza Palace',
              customerAddress: '123 Main St, Apt 4B',
              orderTime: new Date(Date.now() - 45 * 60000),
              deliveryStatus: 'delivered',
              amount: 24.99,
            },
            {
              id: 'ORD-7864',
              restaurantName: 'Burger Bistro',
              customerAddress: '456 Oak Ave',
              orderTime: new Date(Date.now() - 120 * 60000),
              deliveryStatus: 'delivered',
              amount: 18.50,
            },
            {
              id: 'ORD-7861',
              restaurantName: 'Taco Time',
              customerAddress: '789 Pine St',
              orderTime: new Date(Date.now() - 180 * 60000),
              deliveryStatus: 'delivered',
              amount: 32.75,
            },
            {
              id: 'ORD-7858',
              restaurantName: 'Sushi Spot',
              customerAddress: '101 Cedar Blvd',
              orderTime: new Date(Date.now() - 240 * 60000),
              deliveryStatus: 'delivered',
              amount: 45.20,
            },
            {
              id: 'ORD-7852',
              restaurantName: 'Noodle House',
              customerAddress: '202 Maple Dr',
              orderTime: new Date(Date.now() - 360 * 60000),
              deliveryStatus: 'delivered',
              amount: 29.99,
            }
          ];
          
          setStats(mockStats);
          setRecentDeliveries(mockRecentDeliveries);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getTimeAgo = (date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || 'Rider'}</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                  <FiPackage size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalDeliveries}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FiTruck size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completedToday}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <FiClock size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Delivery Time</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.averageTime} min</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <FiDollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link to="/delivery/available-orders" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center">
              <FiPackage className="mr-2" />
              View Available Orders
            </Link>
            <Link to="/delivery/current-order" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
              <FiTruck className="mr-2" />
              Current Delivery
            </Link>
            <Link to="/delivery/earnings" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center">
              <FiDollarSign className="mr-2" />
              Earnings
            </Link>
          </div>

          {/* Recent Deliveries */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Deliveries</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentDeliveries.length > 0 ? (
                recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-md bg-orange-100 text-orange-600 mr-4">
                          <FiPackage size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{delivery.restaurantName}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiMapPin size={12} className="mr-1" />
                            <span>{delivery.customerAddress}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">{delivery.id}</p>
                        <p className="text-sm text-gray-400">{getTimeAgo(delivery.orderTime)}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          delivery.deliveryStatus === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : delivery.deliveryStatus === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {delivery.deliveryStatus.charAt(0).toUpperCase() + delivery.deliveryStatus.slice(1)}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900">{formatCurrency(delivery.amount)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-4 text-center text-gray-500">
                  No recent deliveries found.
                </div>
              )}
            </div>
          </div>

          {/* Today's Schedule - could be implemented in future */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Today's Schedule</h2>
              <div className="flex items-center text-sm text-gray-500">
                <FiCalendar className="mr-1" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            <div className="px-6 py-4 text-center text-gray-500">
              <p>You don't have any scheduled shifts today.</p>
              <button className="mt-2 text-orange-600 hover:text-orange-700 font-medium">
                Set Availability
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;