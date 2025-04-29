import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiShoppingBag, 
  FiClock, 
  FiCalendar,
  FiFilter
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AnalyticsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week'); // week, month, year
  const [analyticsData, setAnalyticsData] = useState({
    summary: {
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      avgPreparationTime: 0,
      newCustomers: 0
    },
    ordersByDay: [],
    revenueByDay: [],
    ordersByCategory: [],
    popularItems: [],
    peakHours: []
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would call your API
        // const response = await restaurantService.getAnalytics(dateRange);
        
        // Mock data for development
        setTimeout(() => {
          // Generate mock data based on the selected date range
          const mockData = generateMockData(dateRange);
          setAnalyticsData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [dateRange]);

  const generateMockData = (range) => {
    let days = [];
    let now = new Date();
    let numDays = range === 'week' ? 7 : range === 'month' ? 30 : 365;
    let dayFormat = range === 'year' ? 'MMM' : 'ddd';
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = numDays - 1; i >= 0; i--) {
      let date = new Date(now);
      date.setDate(date.getDate() - i);
      let dayName = range === 'year' 
        ? months[date.getMonth()] 
        : daysOfWeek[date.getDay()];
      
      days.push({
        date: dayName,
        orders: Math.floor(Math.random() * 40) + 10,
        revenue: (Math.random() * 800 + 200).toFixed(2)
      });
    }

    const categoryData = [
      { name: 'Pizzas', value: 35 },
      { name: 'Burgers', value: 25 },
      { name: 'Sides', value: 20 },
      { name: 'Beverages', value: 15 },
      { name: 'Desserts', value: 5 }
    ];

    const popularItems = [
      { name: 'Pepperoni Pizza', orders: 52, revenue: 675.48 },
      { name: 'Margherita Pizza', orders: 41, revenue: 491.59 },
      { name: 'Cheeseburger', orders: 39, revenue: 429.39 },
      { name: 'Garlic Bread', orders: 35, revenue: 174.65 },
      { name: 'Coca Cola', orders: 32, revenue: 95.68 }
    ];

    const peakHours = [
      { time: '11:00', orders: 15 },
      { time: '12:00', orders: 30 },
      { time: '13:00', orders: 35 },
      { time: '14:00', orders: 25 },
      { time: '15:00', orders: 15 },
      { time: '16:00', orders: 10 },
      { time: '17:00', orders: 20 },
      { time: '18:00', orders: 40 },
      { time: '19:00', orders: 45 },
      { time: '20:00', orders: 35 },
      { time: '21:00', orders: 25 },
      { time: '22:00', orders: 15 }
    ];

    // Calculate summary data
    const totalOrders = days.reduce((sum, day) => sum + day.orders, 0);
    const totalRevenue = days.reduce((sum, day) => sum + parseFloat(day.revenue), 0);
    
    return {
      summary: {
        totalOrders: totalOrders,
        totalRevenue: totalRevenue,
        avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
        avgPreparationTime: 18,
        newCustomers: Math.floor(totalOrders * 0.15)
      },
      ordersByDay: days,
      revenueByDay: days,
      ordersByCategory: categoryData,
      popularItems: popularItems,
      peakHours: peakHours
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Analytics</h1>
          <p className="text-gray-600">Track your restaurant's performance</p>
        </div>
        <div className="flex items-center bg-white rounded-md shadow-sm">
          <button
            onClick={() => setDateRange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              dateRange === 'week'
                ? 'bg-orange-50 text-orange-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-4 py-2 text-sm font-medium ${
              dateRange === 'month'
                ? 'bg-orange-50 text-orange-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setDateRange('year')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              dateRange === 'year'
                ? 'bg-orange-50 text-orange-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <FiShoppingBag size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-xl font-semibold">{analyticsData.summary.totalOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FiDollarSign size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-xl font-semibold">{formatCurrency(analyticsData.summary.totalRevenue)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <FiTrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                  <p className="text-xl font-semibold">{formatCurrency(analyticsData.summary.avgOrderValue)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                  <FiClock size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Prep Time</p>
                  <p className="text-xl font-semibold">{analyticsData.summary.avgPreparationTime} min</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                  <FiUser size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">New Customers</p>
                  <p className="text-xl font-semibold">{analyticsData.summary.newCustomers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Over Time */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Orders Over Time</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analyticsData.ordersByDay}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} orders`, 'Orders']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#FF8042"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2-column charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue by Day */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Over Time</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.revenueByDay}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Revenue']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar dataKey="revenue" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Orders by Category */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Orders by Category</h2>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.ordersByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.ordersByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 2-column tables/charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Popular Items */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Most Popular Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.popularItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.orders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Peak Hours */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Peak Hours</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.peakHours}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} orders`, 'Orders']}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Bar dataKey="orders" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;