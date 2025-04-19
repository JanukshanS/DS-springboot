import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FiPackage, FiMapPin, FiClock, FiDollarSign } from "react-icons/fi";
import { delivery as deliveryService } from "../../services/api";

const OrderHistoryPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("userData");
        if (!storedUser) {
          throw new Error("User data not found in local storage");
        }

        const userData = JSON.parse(storedUser);
        const driverId = userData.id;

        if (!driverId) {
          throw new Error("Driver ID not found in user data");
        }

        const response = await axios.get(
          "http://localhost:8080/api/deliveries/all"
        );

        const filteredDeliveries = response.data.filter(
          (delivery) => String(delivery.driverId) === String(driverId)
        );

        const statusFilter = [
          "delivered",
          "in_progress",
          "assigned",
          "picked_up",
          "pending",
          "cancelled",
        ];
        const filteredDeliveriesByStatus = filteredDeliveries.filter(
          (delivery) => statusFilter.includes(delivery.status.toLowerCase())
        );

        setDeliveries(filteredDeliveriesByStatus);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
        setError("Failed to load deliveries");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in_progress":
      case "assigned":
      case "picked_up":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Delivery History</h1>
        <p className="text-gray-600">View all your past deliveries</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              All Deliveries
            </h2>
          </div>

          {deliveries.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {[...deliveries]
                .sort(
                  (a, b) =>
                    new Date(b.orderTime || b.createdAt || 0) -
                    new Date(a.orderTime || a.createdAt || 0)
                )
                .map((delivery) => (
                  <div key={delivery.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-md bg-orange-100 text-orange-600 mr-4">
                          <FiPackage size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {delivery.restaurantName || "Restaurant"}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiMapPin size={12} className="mr-1" />
                            <span>
                              {delivery.deliveryAddress ||
                                "Address unavailable"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">
                          {delivery.orderId
                            ? `ORD-${delivery.orderId}`
                            : delivery.id}
                        </p>
                        <p className="text-sm text-gray-400">
                          {delivery.createdAt
                            ? formatDate(delivery.createdAt)
                            : "Date unavailable"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(
                            delivery.status || "pending"
                          )}`}
                        >
                          {delivery.status
                            ? delivery.status.charAt(0).toUpperCase() +
                              delivery.status.slice(1).toLowerCase()
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiClock className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No delivery history found
              </h3>
              <p className="text-gray-500">
                You don't have any past deliveries yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
