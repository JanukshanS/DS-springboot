import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingBag, FiUsers, FiClock } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
// import { restaurantService, order as orderService } from '../../services/api';

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
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    orders: 0,
    averageOrderValue: 0,
    customers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would call your API
        // const statsResponse = await restaurantService.getDashboardStats(timeRange);
        // const ordersResponse = await orderService.getRecentOrders(5);
        
        // Mock data for development
        const mockStats = {
          totalRevenue: 5284.75,
          orders: 98,
          averageOrderValue: 53.92,
          customers: 72,
          revenueChange: 12.5,
          ordersChange: 8.3,
          topItems: [
            { name: 'Margherita Pizza', qty: 42, revenue: 629.58 },
            { name: 'Pepperoni Pizza', qty: 38, revenue: 645.62 },
            { name: 'Garlic Bread', qty: 35, revenue: 209.65 },
            { name: 'Chicken Wings', qty: 32, revenue: 415.68 },
            { name: 'Caesar Salad', qty: 28, revenue: 251.72 }
          ],
          salesByDay: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            data: [580.25, 620.50, 540.75, 690.30, 820.45, 1050.25, 982.25]
          },
          salesByHour: {
            labels: ['11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm'],
            data: [210.50, 350.75, 420.25, 320.50, 280.25, 310.50, 450.75, 520.25, 580.50, 630.25, 480.50, 290.25]
          },
          ordersByStatus: {
            labels: ['Pending', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'],
            data: [15, 12, 8, 10, 45, 8]
          }
        };
        
        const mockRecentOrders = [
          {
            id: '12345',
            customer: 'John Doe',
            total: 35.50,
            status: 'DELIVERED',
            items: 4,
            createdAt: new Date(Date.now() - 35 * 60000).toISOString() // 35 min ago
          },
          {
            id: '12344',
            customer: 'Jane Smith',
            total: 42.25,
            status: 'OUT_FOR_DELIVERY',
            items: 3,
            createdAt: new Date(Date.now() - 50 * 60000).toISOString() // 50 min ago
          },
          {
            id: '12343',
            customer: 'Bob Johnson',
            total: 28.99,
            status: 'PREPARING',
            items: 2,
            createdAt: new Date(Date.now() - 70 * 60000).toISOString() // 70 min ago
          },
          {
            id: '12342',
            customer: 'Alice Brown',
            total: 52.50,
            status: 'PENDING',
            items: 5,
            createdAt: new Date(Date.now() - 85 * 60000).toISOString() // 85 min ago
          },
          {
            id: '12341',
            customer: 'Michael Wilson',
            total: 18.75,
            status: 'DELIVERED',
            items: 1,
            createdAt: new Date(Date.now() - 120 * 60000).toISOString() // 2 hours ago
          }
        ];
        
        setStats(mockStats);
        setRecentOrders(mockRecentOrders);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

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