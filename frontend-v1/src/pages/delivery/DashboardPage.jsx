import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiPackage, FiClock, FiTruck, FiDollarSign, FiCalendar, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from "axios";

const DashboardPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedToday: 0,
    averageTime: 0,
  });

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
        setUser(userData);

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
          "cancelled",
        ];
        const filteredDeliveriesByStatus = filteredDeliveries.filter(
          (delivery) => statusFilter.includes(delivery.status.toLowerCase())
        );

        setDeliveries(filteredDeliveriesByStatus);

        // Calculate stats based on real data
        calculateStats(filteredDeliveries);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
        setError("Failed to load deliveries");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  // Format currency amounts
  // Calculate statistics from delivery data
  const calculateStats = (deliveryData) => {
    const today = new Date().setHours(0, 0, 0, 0);

    // Count total deliveries
    const totalDeliveries = deliveryData.length;

    // Count deliveries completed today
    const completedToday = deliveryData.filter(
      (delivery) =>
        delivery.deliveryStatus === "delivered" &&
        new Date(delivery.deliveryTime).setHours(0, 0, 0, 0) === today
    ).length;

    // Calculate average delivery time in minutes
    let totalTime = 0;
    let completedDeliveries = 0;

    deliveryData.forEach((delivery) => {
      if (
        delivery.deliveryStatus === "delivered" &&
        delivery.orderTime &&
        delivery.deliveryTime
      ) {
        const start = new Date(delivery.orderTime);
        const end = new Date(delivery.deliveryTime);
        const timeInMinutes = (end - start) / (1000 * 60);
        if (!isNaN(timeInMinutes) && timeInMinutes > 0) {
          totalTime += timeInMinutes;
          completedDeliveries++;
        }
      }
    });

    const averageTime =
      completedDeliveries > 0 ? Math.round(totalTime / completedDeliveries) : 0;

    setStats({
      totalDeliveries,
      completedToday,
      averageTime,
    });
  };

  // Format currency amounts
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  // Calculate time elapsed
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "N/A";

    const now = new Date();
    const orderTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Get the 5 most recent deliveries
  const recentDeliveries = [...deliveries]
    .sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime))
    .slice(0, 5);

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || "Rider"}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <FiPackage size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Deliveries
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalDeliveries}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiTruck size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completed Today
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.completedToday}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiClock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Average Delivery Time
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.averageTime} min
              </p>
            </div>
          </div>
        </div>
      </div>
      

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link
          to="/delivery/available-orders"
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPackage className="mr-2" />
          View Available Orders
        </Link>
        <Link
          to="/delivery/current-order"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiTruck className="mr-2" />
          Current Delivery
        </Link>
      </div>

      {/* Recent Deliveries */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Recent Deliveries
          </h2>
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
                      <p className="font-medium text-gray-900">
                        {delivery.restaurantName || "Restaurant"}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiMapPin size={12} className="mr-1" />
                        <span>
                          {delivery.deliveryAddress || "No address available"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">
                      #{delivery.id}
                    </p>
                    <p className="text-sm text-gray-400">
                      {getTimeAgo(delivery.orderTime)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        delivery.status === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : delivery.status === "ASSIGNED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {delivery.status
                        ? delivery.status.charAt(0).toUpperCase() +
                          delivery.status.slice(1).replace(/_/g, " ")
                        : "Unknown"}
                    </span>
                  </div>
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

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Today's Schedule
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <FiCalendar className="mr-1" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="px-6 py-4 text-center text-gray-500">
          <p>You don't have any scheduled shifts today.</p>
          <button className="mt-2 text-orange-600 hover:text-orange-700 font-medium">
            Set Availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;