import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingBag, FiUsers, FiClock } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { restaurant as restaurantService, order as orderService } from '../../services/api';
import { fetchRestaurantOrders } from '../../store/slices/orderSlice';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders: ordersList, loading: ordersLoading } = useSelector((state) => state.orders);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    orders: 0,
    averageOrderValue: 0,
    customers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);

  useEffect(() => {
    // Fetch orders for the restaurant
    const restaurantId = user?.restaurantId;
    
    if (restaurantId) {
      // Fetch orders using Redux
      dispatch(fetchRestaurantOrders({ restaurantId }));
      
      // Fetch menu items
      fetchMenuItems(restaurantId);
    } else {
      toast.error('No restaurant ID found. Please check your account settings.');
      setLoading(false);
    }
  }, [dispatch, user]);
  
  // Process orders data when it changes
  useEffect(() => {
    if (!ordersLoading && ordersList && ordersList.length > 0) {
      processOrdersData(ordersList);
    }
  }, [ordersLoading, ordersList, timeRange]);
  
  const fetchMenuItems = async (restaurantId) => {
    try {
      setMenuLoading(true);
      const response = await restaurantService.getMenuAll(restaurantId);
      if (response && response.data) {
        setMenuItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setMenuLoading(false);
    }
  };
  
  const processOrdersData = (orders) => {
    try {
      setLoading(true);
      
      // Filter orders based on time range
      const filteredOrders = filterOrdersByTimeRange(orders, timeRange);
      
      // Calculate total revenue
      const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      // Count unique customers
      const uniqueCustomers = new Set(filteredOrders.map(order => order.userId)).size;
      
      // Calculate average order value
      const averageOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
      
      // Get order counts by status
      const ordersByStatus = getOrderCountsByStatus(filteredOrders);
      
      // Get sales by day
      const salesByDay = getSalesByDay(filteredOrders);
      
      // Get sales by hour
      const salesByHour = getSalesByHour(filteredOrders);
      
      // Get top selling items
      const topItems = getTopSellingItems(filteredOrders);
      
      // Get recent orders (last 5)
      const recentOrdersData = getRecentOrders(orders, 5);
      
      // Set stats
      setStats({
        totalRevenue,
        orders: filteredOrders.length,
        averageOrderValue,
        customers: uniqueCustomers,
        revenueChange: calculateRevenueChange(orders, timeRange),
        ordersChange: calculateOrdersChange(orders, timeRange),
        topItems,
        salesByDay,
        salesByHour,
        ordersByStatus
      });
      
      setRecentOrders(recentOrdersData);
    } catch (error) {
      console.error('Error processing orders data:', error);
      toast.error('Error processing dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  const filterOrdersByTimeRange = (orders, range) => {
    const now = new Date();
    let startDate;
    
    switch (range) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
    }
    
    return orders.filter(order => new Date(order.orderTime) >= startDate);
  };
  
  const getOrderCountsByStatus = (orders) => {
    const statusCounts = {
      'PENDING': 0,
      'PREPARING': 0,
      'READY_FOR_PICKUP': 0,
      'OUT_FOR_DELIVERY': 0,
      'DELIVERED': 0,
      'CANCELLED': 0
    };
    
    orders.forEach(order => {
      if (statusCounts.hasOwnProperty(order.status)) {
        statusCounts[order.status]++;
      }
    });
    
    return {
      labels: Object.keys(statusCounts).map(status => formatStatus(status)),
      data: Object.values(statusCounts)
    };
  };
  
  const getSalesByDay = (orders) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const salesByDay = Array(7).fill(0);
    
    orders.forEach(order => {
      const orderDate = new Date(order.orderTime);
      const dayIndex = orderDate.getDay();
      salesByDay[dayIndex] += (order.totalAmount || 0);
    });
    
    // Reorder days to start with Monday
    const mondayFirst = [...salesByDay.slice(1), salesByDay[0]];
    const mondayFirstLabels = [...days.slice(1), days[0]];
    
    return {
      labels: mondayFirstLabels,
      data: mondayFirst
    };
  };
  
  const getSalesByHour = (orders) => {
    const hours = Array.from({ length: 12 }, (_, i) => `${i + 11}${i + 11 > 12 ? 'pm' : 'am'}`);
    const salesByHour = Array(12).fill(0);
    
    orders.forEach(order => {
      const orderDate = new Date(order.orderTime);
      const hour = orderDate.getHours();
      
      // Only count orders between 11am and 10pm (11-22)
      if (hour >= 11 && hour <= 22) {
        const index = hour - 11;
        salesByHour[index] += (order.totalAmount || 0);
      }
    });
    
    return {
      labels: hours,
      data: salesByHour
    };
  };
  
  const getTopSellingItems = (orders) => {
    const itemCounts = {};
    
    // Count occurrences of each menu item
    orders.forEach(order => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach(item => {
          const menuItemId = item.menuItemId;
          if (!itemCounts[menuItemId]) {
            itemCounts[menuItemId] = {
              id: menuItemId,
              qty: 0,
              revenue: 0
            };
          }
          itemCounts[menuItemId].qty += (item.quantity || 1);
          itemCounts[menuItemId].revenue += (item.price || 0) * (item.quantity || 1);
        });
      }
    });
    
    // Convert to array and sort by revenue
    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(item => ({
        ...item,
        name: getMenuItemName(item.id)
      }));
    
    return topItems;
  };
  
  const getMenuItemName = (menuItemId) => {
    if (!menuItemId || !menuItems || !menuItems.length) return `Menu Item #${menuItemId}`;
    
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (menuItem) {
      return menuItem.name;
    }
    return `Menu Item #${menuItemId}`;
  };
  
  const getRecentOrders = (orders, limit) => {
    // Create a copy of the array before sorting to avoid modifying the original array
    return [...orders]
      .sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime))
      .slice(0, limit)
      .map(order => ({
        id: order.id,
        customer: `User #${order.userId}`,
        total: order.totalAmount || 0,
        status: order.status,
        items: order.orderItems ? order.orderItems.length : 0,
        createdAt: order.orderTime
      }));
  };
  
  const calculateRevenueChange = (orders, timeRange) => {
    // This is a simplified calculation
    // In a real app, you would compare with previous period
    return 5.2; // Placeholder
  };
  
  const calculateOrdersChange = (orders, timeRange) => {
    // This is a simplified calculation
    // In a real app, you would compare with previous period
    return 3.8; // Placeholder
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    
    // Convert from ENUM_STYLE to Display Style
    return status.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PREPARING':
        return 'bg-blue-100 text-blue-800';
      case 'READY_FOR_PICKUP':
        return 'bg-purple-100 text-purple-800';
      case 'OUT_FOR_DELIVERY':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const salesLineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales by Day',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value)
        }
      }
    }
  };

  const salesLineChartData = {
    labels: stats.salesByDay?.labels || [],
    datasets: [
      {
        label: 'Revenue',
        data: stats.salesByDay?.data || [],
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.5)',
        tension: 0.3
      }
    ]
  };

  const hourlyBarChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales by Hour',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value)
        }
      }
    }
  };

  const hourlyBarChartData = {
    labels: stats.salesByHour?.labels || [],
    datasets: [
      {
        label: 'Revenue',
        data: stats.salesByHour?.data || [],
        backgroundColor: 'rgba(234, 88, 12, 0.7)',
      }
    ]
  };

  const orderStatusDoughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Orders by Status',
      },
    }
  };

  const orderStatusDoughnutData = {
    labels: stats.ordersByStatus?.labels || [],
    datasets: [
      {
        label: 'Orders',
        data: stats.ordersByStatus?.data || [],
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(46, 204, 113, 0.7)',
          'rgba(231, 76, 60, 0.7)'
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(46, 204, 113, 1)',
          'rgba(231, 76, 60, 1)'
        ],
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Restaurant Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName || 'Restaurant Manager'}</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === 'today'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === 'week'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === 'month'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="p-2 rounded-full bg-orange-100 text-orange-700">
                  <FiDollarSign size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stats.revenueChange >= 0 ? (
                  <FiTrendingUp className="text-green-500" />
                ) : (
                  <FiTrendingDown className="text-red-500" />
                )}
                <span className={`text-sm ml-1 ${stats.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(stats.revenueChange)}% from previous period
                </span>
              </div>
            </div>
            
            {/* Total Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stats.orders}</p>
                </div>
                <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                  <FiShoppingBag size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stats.ordersChange >= 0 ? (
                  <FiTrendingUp className="text-green-500" />
                ) : (
                  <FiTrendingDown className="text-red-500" />
                )}
                <span className={`text-sm ml-1 ${stats.ordersChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(stats.ordersChange)}% from previous period
                </span>
              </div>
            </div>
            
            {/* Average Order Value */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Order</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(stats.averageOrderValue)}</p>
                </div>
                <div className="p-2 rounded-full bg-green-100 text-green-700">
                  <FiDollarSign size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-500">Per order average</span>
              </div>
            </div>
            
            {/* Total Customers */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customers</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stats.customers}</p>
                </div>
                <div className="p-2 rounded-full bg-purple-100 text-purple-700">
                  <FiUsers size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-500">Unique customers</span>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Line options={salesLineChartOptions} data={salesLineChartData} />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Bar options={hourlyBarChartOptions} data={hourlyBarChartData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                <a href="/restaurant-admin/orders" className="text-sm text-orange-600 hover:text-orange-700">
                  View all orders
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-orange-600">
                          #{order.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {order.customer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.items} {order.items === 1 ? 'item' : 'items'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                            {formatStatus(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Orders by Status Doughnut */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Doughnut options={orderStatusDoughnutOptions} data={orderStatusDoughnutData} />
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Top Selling Items</h2>
              <a href="/restaurant-admin/menu" className="text-sm text-orange-600 hover:text-orange-700">
                Manage menu
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Units Sold
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.topItems?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.qty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;