import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiFilter, FiSearch, FiChevronDown, FiChevronUp, FiClock, FiInfo, FiCheckCircle, FiXCircle, FiTruck, FiUser } from 'react-icons/fi';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { fetchRestaurantOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import { restaurant as restaurantService, user as userService } from '../../services/api';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders: ordersList, loading, error } = useSelector((state) => state.orders);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [usernames, setUsernames] = useState({});
  const [loadingUsernames, setLoadingUsernames] = useState(false);
  
  useEffect(() => {
    // Fetch orders for the restaurant
    // If user is a restaurant owner, get their restaurant ID from the user object
    const restaurantId = user?.restaurantId;
    
    if (restaurantId) {
      dispatch(fetchRestaurantOrders({ restaurantId }));
      
      // Fetch menu items for the restaurant
      fetchMenuItems(restaurantId);
    } else {
      // If no restaurant ID is available, show an error
      toast.error('No restaurant ID found. Please check your account settings.');
    }
  }, [dispatch, user]);
  
  // Fetch usernames for all orders when ordersList changes
  useEffect(() => {
    if (ordersList && ordersList.length > 0) {
      fetchUsernames();
    }
  }, [ordersList]);
  
  // Function to fetch usernames for all user IDs in the orders
  const fetchUsernames = async () => {
    try {
      setLoadingUsernames(true);
      
      // Get unique user IDs from orders
      const userIds = [...new Set(ordersList.map(order => order.userId).filter(id => id))];
      
      if (userIds.length === 0) {
        setLoadingUsernames(false);
        return;
      }
      
      // Create a map to store usernames
      const usernameMap = {};
      
      // Fetch user details for each user ID
      const fetchPromises = userIds.map(async (userId) => {
        try {
          const response = await userService.getUserById(userId);
          return { userId, username: response.data.username || response.data.name || `User ${userId}` };
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return { userId, username: `User ${userId}` }; // Fallback
        }
      });
      
      // Wait for all requests to complete
      const results = await Promise.all(fetchPromises);
      
      // Build the username map
      results.forEach(result => {
        usernameMap[result.userId] = result.username;
      });
      
      setUsernames(usernameMap);
    } catch (error) {
      console.error('Error fetching usernames:', error);
    } finally {
      setLoadingUsernames(false);
    }
  };
  
  const fetchMenuItems = async (restaurantId) => {
    try {
      setMenuLoading(true);
      const response = await restaurantService.getMenuAll(restaurantId);
      if (response && response.data) {
        setMenuItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setMenuLoading(false);
    }
  };
  
  // Show error toast if API request fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...ordersList];
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toString().toLowerCase().includes(lowercaseSearch) ||
        (usernames[order.userId] && usernames[order.userId].toLowerCase().includes(lowercaseSearch)) ||
        (order.customer?.name && order.customer.name.toLowerCase().includes(lowercaseSearch)) ||
        (order.customer?.phone && order.customer.phone.toLowerCase().includes(lowercaseSearch)) ||
        (order.items && order.items.some(item => item.name.toLowerCase().includes(lowercaseSearch)))
      );
    }
    
    // Sort
    result.sort((a, b) => {
      let valA, valB;
      
      switch (sortField) {
        case 'id':
          valA = a.id;
          valB = b.id;
          break;
        case 'customer':
          valA = a.customer?.name || '';
          valB = b.customer?.name || '';
          break;
        case 'total':
          valA = a.total;
          valB = b.total;
          break;
        case 'createdAt':
        default:
          valA = new Date(a.createdAt).getTime();
          valB = new Date(b.createdAt).getTime();
          break;
      }
      
      if (sortDirection === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
    
    setFilteredOrders(result);
  }, [ordersList, statusFilter, searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Dispatch the updateOrderStatus action
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      toast.success(`Order #${orderId} updated to ${formatStatus(newStatus)}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const options = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const calculateSubtotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  };
  
  const formatPaymentMethod = (method) => {
    if (!method) return 'Unknown';
    return method.replace('_', ' ').replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  
  const getMenuItemName = (menuItemId) => {
    if (!menuItemId || !menuItems || !menuItems.length) return `Menu Item #${menuItemId}`;
    
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (menuItem) {
      return menuItem.name;
    }
    return `Menu Item #${menuItemId}`;
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

  const getNextStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case 'PENDING':
        return [{ value: 'PREPARING', label: 'Accept & Prepare' }, { value: 'CANCELLED', label: 'Cancel Order' }];
      case 'PREPARING':
        return [{ value: 'READY_FOR_PICKUP', label: 'Ready for Pickup' }];
      case 'READY_FOR_PICKUP':
        return [{ value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' }];
      case 'OUT_FOR_DELIVERY':
        return [{ value: 'DELIVERED', label: 'Delivered' }];
      default:
        return [];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <FiClock className="text-yellow-500" />;
      case 'PREPARING':
        return <FiInfo className="text-blue-500" />;
      case 'READY_FOR_PICKUP':
        return <FiCheckCircle className="text-purple-500" />;
      case 'OUT_FOR_DELIVERY':
        return <FiTruck className="text-indigo-500" />;
      case 'DELIVERED':
        return <FiCheckCircle className="text-green-500" />;
      case 'CANCELLED':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-500" />
            <span className="text-gray-700 font-medium">Filter by Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY_FOR_PICKUP">Ready for Pickup</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders by ID, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No Orders Found</h2>
          <p className="text-gray-600">
            {searchTerm ? 'No orders match your search criteria.' : 
             statusFilter !== 'all' ? `No orders with status "${formatStatus(statusFilter)}"` : 
             'You haven\'t received any orders yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      Order ID
                      {sortField === 'id' && (
                        sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('customer')}
                  >
                    <div className="flex items-center">
                      Customer
                      {sortField === 'customer' && (
                        sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center">
                      Total
                      {sortField === 'total' && (
                        sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Date
                      {sortField === 'createdAt' && (
                        sortDirection === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FiUser className="text-gray-400 mr-2" />
                          {loadingUsernames ? (
                            <span className="text-gray-500">Loading user...</span>
                          ) : (
                            <span>{usernames[order.userId] || `User ${order.userId || 'Unknown'}`}</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs">Order #{order.id}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${(order.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{formatStatus(order.status)}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.orderTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {getNextStatusOptions(order.status).length > 0 ? (
                          <div className="flex space-x-2">
                            {getNextStatusOptions(order.status).map(option => (
                              <Button
                                key={option.value}
                                size="sm"
                                variant={option.value === 'CANCELLED' ? 'danger' : 'primary'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(order.id, option.value);
                                }}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">No actions</span>
                        )}
                      </td>
                    </tr>
                    
                    {/* Expanded Order Details */}
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 bg-gray-50">
                          <div className="px-4 py-2">
                            <div className="mb-4">
                              <h3 className="text-lg font-medium text-gray-900 mb-2">Order Items</h3>
                              <div className="bg-white rounded-md shadow-sm p-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Item
                                      </th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                      </th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                      </th>
                                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {order.orderItems && order.orderItems.map((item) => (
                                      <tr key={item.id || index}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                          {getMenuItemName(item.menuItemId)}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                          ${(item.price || 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                          {item.quantity || 1}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot className="bg-gray-50">
                                    <tr>
                                      <td colSpan="3" className="px-4 py-2 text-sm text-right font-medium text-gray-500">
                                        Subtotal:
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        ${calculateSubtotal(order.orderItems).toFixed(2)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan="3" className="px-4 py-2 text-sm text-right font-medium text-gray-500">
                                        Delivery Fee:
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        $0.00
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan="3" className="px-4 py-2 text-sm text-right font-medium text-gray-500">
                                        Tax:
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        $0.00
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan="3" className="px-4 py-2 text-sm text-right font-bold text-gray-900">
                                        Total:
                                      </td>
                                      <td className="px-4 py-2 text-sm font-bold text-gray-900">
                                        ${(order.totalAmount || 0).toFixed(2)}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Delivery Information</h3>
                                <div className="bg-white rounded-md shadow-sm p-4">
                                  <p className="text-sm text-gray-700 mb-2">
                                    <span className="font-medium">Address:</span> {order.deliveryAddress || 'No address provided'}
                                  </p>
                                  <p className="text-sm text-gray-700 mb-2">
                                    <span className="font-medium">Method:</span> {formatPaymentMethod(order.paymentMethod) || 'Unknown'}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Status:</span>{' '}
                                    <span className={order.isPaid ? 'text-green-600' : 'text-red-600'}>
                                      {order.isPaid ? 'PAID' : 'UNPAID'}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;