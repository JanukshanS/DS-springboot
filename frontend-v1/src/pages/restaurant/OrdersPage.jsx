import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiFilter, FiSearch, FiChevronDown, FiChevronUp, FiClock, FiInfo, FiCheckCircle, FiXCircle, FiTruck } from 'react-icons/fi';
import { order as orderService } from '../../services/api';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getRestaurantOrders();
        
        // Mock data for development
        const mockOrders = [
          {
            id: '12345',
            customer: { name: 'John Doe', phone: '(123) 456-7890' },
            items: [
              { id: '101', name: 'Margherita Pizza', price: 14.99, quantity: 1 },
              { id: '102', name: 'Garlic Bread', price: 5.99, quantity: 2 }
            ],
            subtotal: 26.97,
            deliveryFee: 3.99,
            tax: 2.47,
            total: 33.43,
            status: 'PENDING',
            paymentStatus: 'PAID',
            paymentMethod: 'Credit Card',
            deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
            specialInstructions: 'Please include extra napkins',
            createdAt: new Date().toISOString(),
            estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString() // 30 min from now
          },
          {
            id: '12344',
            customer: { name: 'Jane Smith', phone: '(456) 789-0123' },
            items: [
              { id: '103', name: 'Pepperoni Pizza', price: 16.99, quantity: 1 },
              { id: '104', name: 'Chicken Wings', price: 12.99, quantity: 1 },
              { id: '105', name: 'Soda', price: 2.99, quantity: 2 }
            ],
            subtotal: 35.96,
            deliveryFee: 3.99,
            tax: 3.20,
            total: 43.15,
            status: 'PREPARING',
            paymentStatus: 'PAID',
            paymentMethod: 'PayPal',
            deliveryAddress: '456 Elm St, Brooklyn, NY 11201',
            specialInstructions: '',
            createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 min ago
            estimatedDeliveryTime: new Date(Date.now() + 15 * 60000).toISOString() // 15 min from now
          },
          {
            id: '12343',
            customer: { name: 'Bob Johnson', phone: '(789) 012-3456' },
            items: [
              { id: '106', name: 'Caesar Salad', price: 8.99, quantity: 1 },
              { id: '107', name: 'Lasagna', price: 18.99, quantity: 1 }
            ],
            subtotal: 27.98,
            deliveryFee: 3.99,
            tax: 2.56,
            total: 34.53,
            status: 'READY_FOR_PICKUP',
            paymentStatus: 'PAID',
            paymentMethod: 'Credit Card',
            deliveryAddress: '789 Oak St, Queens, NY 11354',
            specialInstructions: 'No utensils needed',
            createdAt: new Date(Date.now() - 45 * 60000).toISOString(), // 45 min ago
            estimatedDeliveryTime: new Date(Date.now() + 5 * 60000).toISOString() // 5 min from now
          },
          {
            id: '12342',
            customer: { name: 'Alice Brown', phone: '(321) 654-9870' },
            items: [
              { id: '108', name: 'Spaghetti Carbonara', price: 13.99, quantity: 2 }
            ],
            subtotal: 27.98,
            deliveryFee: 3.99,
            tax: 2.56,
            total: 34.53,
            status: 'OUT_FOR_DELIVERY',
            paymentStatus: 'PAID',
            paymentMethod: 'Cash on Delivery',
            deliveryAddress: '321 Pine St, Bronx, NY 10451',
            specialInstructions: '',
            createdAt: new Date(Date.now() - 60 * 60000).toISOString(), // 60 min ago
            estimatedDeliveryTime: new Date(Date.now() - 10 * 60000).toISOString() // 10 min ago (overdue)
          },
          {
            id: '12341',
            customer: { name: 'Tom Wilson', phone: '(654) 987-0123' },
            items: [
              { id: '109', name: 'Chicken Alfredo', price: 15.99, quantity: 1 },
              { id: '110', name: 'Tiramisu', price: 8.99, quantity: 1 },
              { id: '111', name: 'Iced Tea', price: 3.99, quantity: 1 }
            ],
            subtotal: 28.97,
            deliveryFee: 3.99,
            tax: 2.63,
            total: 35.59,
            status: 'DELIVERED',
            paymentStatus: 'PAID',
            paymentMethod: 'Credit Card',
            deliveryAddress: '654 Maple St, Manhattan, NY 10001',
            specialInstructions: 'Leave at door',
            createdAt: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
            deliveredAt: new Date(Date.now() - 75 * 60000).toISOString() // 75 min ago
          },
          {
            id: '12340',
            customer: { name: 'Sarah Davis', phone: '(987) 654-3210' },
            items: [
              { id: '112', name: 'Veggie Pizza', price: 15.99, quantity: 1 },
              { id: '113', name: 'Garden Salad', price: 7.99, quantity: 1 }
            ],
            subtotal: 23.98,
            deliveryFee: 3.99,
            tax: 2.24,
            total: 30.21,
            status: 'CANCELLED',
            paymentStatus: 'REFUNDED',
            paymentMethod: 'Credit Card',
            deliveryAddress: '987 Cedar St, Staten Island, NY 10301',
            specialInstructions: '',
            createdAt: new Date(Date.now() - 180 * 60000).toISOString(), // 3 hours ago
            cancelledAt: new Date(Date.now() - 175 * 60000).toISOString() // 175 min ago
          }
        ];
        
        setOrders(response?.data || mockOrders);
        setFilteredOrders(response?.data || mockOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...orders];
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(lowercaseSearch) ||
        order.customer.name.toLowerCase().includes(lowercaseSearch) ||
        order.customer.phone.toLowerCase().includes(lowercaseSearch) ||
        order.items.some(item => item.name.toLowerCase().includes(lowercaseSearch))
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
          valA = a.customer.name;
          valB = b.customer.name;
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
  }, [orders, statusFilter, searchTerm, sortField, sortDirection]);

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
      setLoading(true);
      
      // In a real app, you would call your API
      // await orderService.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order #${orderId} updated to ${formatStatus(newStatus)}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
                        {order.customer.name}
                        <p className="text-gray-500 text-xs">{order.customer.phone}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.total.toFixed(2)}
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
                        {formatDate(order.createdAt)}
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
                                    {order.items.map((item) => (
                                      <tr key={item.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                          {item.name}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                          ${item.price.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                          {item.quantity}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                          ${(item.price * item.quantity).toFixed(2)}
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
                                        ${order.subtotal.toFixed(2)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan="3" className="px-4 py-2 text-sm text-right font-medium text-gray-500">
                                        Delivery Fee:
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        ${order.deliveryFee.toFixed(2)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan="3" className="px-4 py-2 text-sm text-right font-medium text-gray-500">
                                        Tax:
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        ${order.tax.toFixed(2)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan="3" className="px-4 py-2 text-sm text-right font-bold text-gray-900">
                                        Total:
                                      </td>
                                      <td className="px-4 py-2 text-sm font-bold text-gray-900">
                                        ${order.total.toFixed(2)}
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
                                    <span className="font-medium">Address:</span> {order.deliveryAddress}
                                  </p>
                                  {order.specialInstructions && (
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">Special Instructions:</span> {order.specialInstructions}
                                    </p>
                                  )}
                                  {order.estimatedDeliveryTime && (
                                    <p className="text-sm text-gray-700 mt-2">
                                      <span className="font-medium">Estimated Delivery:</span> {formatDate(order.estimatedDeliveryTime)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Information</h3>
                                <div className="bg-white rounded-md shadow-sm p-4">
                                  <p className="text-sm text-gray-700 mb-2">
                                    <span className="font-medium">Method:</span> {order.paymentMethod}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Status:</span>{' '}
                                    <span className={order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'}>
                                      {order.paymentStatus}
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