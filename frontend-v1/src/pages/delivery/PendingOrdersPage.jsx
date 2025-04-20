import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiPackage, FiMapPin, FiDollarSign, FiClock, FiUser, FiInfo, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PendingOrdersPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        setLoading(true);

        // Get user data from localStorage
        const storedUser = localStorage.getItem("userData");
        if (!storedUser) {
          throw new Error("User data not found in local storage");
        }

        const userData = JSON.parse(storedUser);
        const driverId = userData.id;

        if (!driverId) {
          throw new Error("Driver ID not found in user data");
        }

        // Fetch all deliveries from the API
        const deliveriesResponse = await axios.get(
          "http://localhost:8080/api/deliveries/all"
        );

        // Fetch orders with READY_FOR_PICKUP status
        const readyOrdersResponse = await axios.get(
          "http://localhost:8080/api/orders/status/READY_FOR_PICKUP"
        );

        // Get the order IDs that are ready for pickup
        const readyOrderIds = readyOrdersResponse.data.map((order) => order.id);

        // Filter for pending deliveries that have an orderId in the readyOrderIds list
        const filteredOrders = deliveriesResponse.data.filter(
          (delivery) =>
            delivery.status.toLowerCase() === "pending" &&
            readyOrderIds.includes(delivery.orderId)
        );

        setPendingOrders(filteredOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    setIsAccepting(true);

    try {
      // Get user data from localStorage
      const storedUser = localStorage.getItem("userData");
      if (!storedUser) {
        throw new Error("User data not found in local storage");
      }

      const userData = JSON.parse(storedUser);
      const driverId = userData.id;
      const driverName = userData.fullname || "Delivery Driver";
      const driverPhone = userData.driverPhone || "Not available";

      if (!driverId) {
        throw new Error("Driver ID not found in user data");
      }

      // Prepare the data for the API call
      const driverInfo = {
        driverId: driverId,
        driverName: driverName,
        driverPhone: driverPhone,
      };

      // Make the API call to assign the driver to the delivery
      await axios.patch(
        `http://localhost:8080/api/deliveries/${orderId}/assign`,
        driverInfo
      );

      // Refresh the list of pending orders
      const deliveriesResponse = await axios.get(
        "http://localhost:8080/api/deliveries/all"
      );

      // Fetch orders with READY_FOR_PICKUP status
      const readyOrdersResponse = await axios.get(
        "http://localhost:8080/api/orders/status/READY_FOR_PICKUP"
      );

      // Get the order IDs that are ready for pickup
      const readyOrderIds = readyOrdersResponse.data.map((order) => order.id);

      // Filter for pending deliveries that have an orderId in the readyOrderIds list
      const filteredOrders = deliveriesResponse.data.filter(
        (delivery) =>
          delivery.status.toLowerCase() === "pending" &&
          readyOrderIds.includes(delivery.orderId)
      );

      setPendingOrders(filteredOrders);

      // Navigate to the current order page
      navigate("/delivery/current-order");
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Failed to accept order. Please try again.");
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    return `${minutes} min ago`;
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Orders</h1>
          <p className="text-gray-600">
            Orders ready for pickup and available for delivery
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingOrders.length > 0 ? (
            [...pendingOrders]
              .sort(
                (a, b) =>
                  new Date(b.orderTime || b.createdAt || 0) -
                  new Date(a.orderTime || a.createdAt || 0)
              )
              .map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {order.restaurantName || "Restaurant"}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FiMapPin size={12} className="mr-1" />
                          <span>
                            {order.restaurantAddress || "Address unavailable"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                          Pending
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Order #{order.orderId || order.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <FiUser size={14} className="mr-2" />
                      <span className="font-medium">Deliver to: </span>
                      <span className="ml-1">
                        {order.customerName || "Customer"}
                      </span>
                    </div>

                    <div className="flex items-start text-sm text-gray-600 mb-3">
                      <FiMapPin size={14} className="mr-2 mt-1" />
                      <span>
                        {order.deliveryAddress || "Address unavailable"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center text-gray-700">
                          <FiDollarSign size={14} className="mr-1" />
                          <span className="font-medium">
                            {formatCurrency(order.total || 0)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Order Total
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center text-gray-700">
                          <FiClock size={14} className="mr-1" />
                          <span className="font-medium">
                            {order.orderTime
                              ? formatTimeAgo(order.orderTime)
                              : "N/A"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Order Time</p>
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
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Available Orders
              </h3>
              <p className="text-gray-600">
                There are no orders ready for pickup and available for delivery
                at the moment.
                <br />
                Check back soon!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Order Details
                    </h3>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {selectedOrder.restaurantName || "Restaurant"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {selectedOrder.restaurantAddress ||
                              "Address unavailable"}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                          #{selectedOrder.orderId || selectedOrder.id}
                        </span>
                      </div>

                      <div className="border-t border-b border-gray-200 py-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Order Items
                        </h4>
                        <ul className="space-y-2">
                          {selectedOrder.items &&
                          selectedOrder.items.length > 0 ? (
                            selectedOrder.items.map((item, index) => (
                              <li
                                key={index}
                                className="flex justify-between text-sm"
                              >
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-gray-500">
                              No items available
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Delivery Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <FiUser size={14} className="mr-2 mt-1" />
                            <div>
                              <p className="text-gray-700">
                                {selectedOrder.customerName || "Customer"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <FiMapPin size={14} className="mr-2 mt-1" />
                            <div>
                              <p className="text-gray-700">
                                {selectedOrder.deliveryAddress ||
                                  "Address unavailable"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Order Total:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(selectedOrder.total || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Order Time:
                          </span>
                          <span className="font-medium">
                            {selectedOrder.orderTime
                              ? new Date(
                                  selectedOrder.orderTime
                                ).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className="font-medium text-yellow-600">
                            Available
                          </span>
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
                  {isAccepting ? "Accepting..." : "Accept Order"}
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

export default PendingOrdersPage;
