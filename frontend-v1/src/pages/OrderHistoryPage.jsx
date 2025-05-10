import React, { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiTruck, FiPackage, FiRefreshCw, FiSearch, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStepper, setShowStepper] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  
  const userId = JSON.parse(localStorage.getItem('userData'))?.id;

  const orderStatuses = [
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY_FOR_PICKUP',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ];

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/orders/user/${userId}`);
        setOrders(response.data || []);
        setFilteredOrders(response.data || []);
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

  // Apply search filter whenever searchTerm or orders change
  useEffect(() => {
    const filtered = orders.filter(order => 
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.totalAmount.toString().includes(searchTerm)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, orders]);

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

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setShowStepper(true);
  };

  const handleCancelOrder = async (orderId) => {
    setCancelling(true);
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, { status: 'CANCELLED' });
      const updatedOrders = orders.map((order) => 
        order.id === orderId ? { ...order, status: 'CANCELLED' } : order
      );
      setOrders(updatedOrders);
      setSelectedOrder((prev) => (prev ? { ...prev, status: 'CANCELLED' } : null));
      setShowConfirmDialog(false);
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel the order. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('Order History', 14, 22);
    
    // Date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Table data
    const tableData = filteredOrders.map(order => [
      order.id,
      formatDate(order.orderTime),
      order.status.replace(/_/g, ' '),
      `$${order.totalAmount.toFixed(2)}`
    ]);
    
    // Table headers
    const headers = [
      ['Order ID', 'Date', 'Status', 'Total Amount']
    ];
    
    // Generate table
    doc.autoTable({
      head: headers,
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    doc.save('order_history.pdf');
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      
      {/* Search and PDF controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiDownload /> Export to PDF
        </button>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-4">No Orders Found</h2>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No orders match your search.' : 'You haven\'t placed any orders yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
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
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 text-sm text-gray-800">{order.id}</td>
                    <td className="py-3 px-6 text-sm text-gray-800">{formatDate(order.orderTime)}</td>
                    <td className="py-3 px-6 text-sm text-gray-800 flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status.replace(/_/g, ' ').toLowerCase()}</span>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-800">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-6 text-center text-sm">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                        onClick={() => handleTrackOrder(order)}
                      >
                        Track Order
                      </button>
                      <button
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                <FiChevronLeft /> Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-full ${currentPage === number ? 'bg-orange-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* Stepper Modal */}
      {showStepper && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Tracking Order #{selectedOrder.id}</h2>
            <div className="flex flex-col gap-4">
              {orderStatuses.map((status, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                      selectedOrder.status === status
                        ? 'bg-blue-500'
                        : orderStatuses.indexOf(selectedOrder.status) > index
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-sm ${
                      selectedOrder.status === status
                        ? 'font-bold text-blue-500'
                        : orderStatuses.indexOf(selectedOrder.status) > index
                        ? 'text-green-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={() => setShowStepper(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h3 className="text-xl font-bold mb-4">Confirm Cancellation</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel this order?</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
                onClick={() => setShowConfirmDialog(false)}
              >
                No
              </button>
              <button
                className={`bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded ${
                  cancelling ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => handleCancelOrder(selectedOrder.id)}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;