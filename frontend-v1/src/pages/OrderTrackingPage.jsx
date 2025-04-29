import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiCheckCircle, FiTruck, FiMapPin, FiPhone } from 'react-icons/fi';
import { orderService, deliveryService, mapService } from '../services/api';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import MapComponent from '../components/common/MapComponent';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [deliveryCoordinates, setDeliveryCoordinates] = useState(null);

  // Track order status progression
  const orderStages = [
    { id: 'placed', label: 'Order Placed', icon: FiCheckCircle },
    { id: 'preparing', label: 'Preparing', icon: FiClock },
    { id: 'ready', label: 'Ready for Pickup', icon: FiCheckCircle },
    { id: 'picked', label: 'Out for Delivery', icon: FiTruck },
    { id: 'delivered', label: 'Delivered', icon: FiCheckCircle },
  ];

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        // Fetch order details
        const orderResponse = await orderService.getById(id);
        setOrder(orderResponse.data);

        // Fetch delivery tracking if order is in delivery stage
        if (orderResponse.data.status === 'picked' || orderResponse.data.status === 'delivered') {
          const deliveryResponse = await deliveryService.trackDelivery(orderResponse.data.deliveryId);
          setDelivery(deliveryResponse.data);

          // Get delivery location for map if available
          if (deliveryResponse.data && deliveryResponse.data.currentLocation) {
            try {
              // Try to geocode the delivery address
              const addressCoords = await mapService.geocodeAddress(orderResponse.data.deliveryAddress.street + ', ' +
                orderResponse.data.deliveryAddress.city + ', ' +
                orderResponse.data.deliveryAddress.state + ' ' +
                orderResponse.data.deliveryAddress.zipCode);

              // Set map center to delivery address
              setMapCenter([addressCoords.lat, addressCoords.lng]);

              // Create markers for restaurant and delivery person
              const markers = [
                {
                  position: [addressCoords.lat, addressCoords.lng],
                  title: 'Delivery Address',
                  popup: 'Your delivery address',
                  icon: {
                    url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png'
                  }
                }
              ];

              // Add delivery person marker if location is available
              if (deliveryResponse.data.currentLocation) {
                const deliveryLat = deliveryResponse.data.currentLocation.latitude;
                const deliveryLng = deliveryResponse.data.currentLocation.longitude;

                setDeliveryCoordinates([deliveryLat, deliveryLng]);

                markers.push({
                  position: [deliveryLat, deliveryLng],
                  title: 'Delivery Person',
                  popup: 'Your delivery is on the way!',
                  icon: {
                    url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'
                  }
                });
              }

              setMapMarkers(markers);
            } catch (mapError) {
              console.error('Error setting up map:', mapError);
              // Don't set error state, just log it - the map is not critical
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();

    // Set up polling for real-time updates every 30 seconds
    const intervalId = setInterval(fetchOrderData, 30000);

    return () => clearInterval(intervalId);
  }, [id]);

  const getCurrentStageIndex = () => {
    if (!order) return -1;
    return orderStages.findIndex((stage) => stage.id === order.status);
  };

  const stageIndex = getCurrentStageIndex();

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleGoBack = () => {
    navigate('/orders');
  };

  const handleCallDriver = () => {
    if (delivery?.driver?.phone) {
      window.location.href = `tel:${delivery.driver.phone}`;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <button onClick={handleGoBack} className="mr-4 text-gray-600 hover:text-gray-900">
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-rowdies font-bold">Order Tracking</h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : order ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Order Status */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Order #{order.orderNumber || id}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {order.status === 'placed' && 'Order Placed'}
                      {order.status === 'preparing' && 'Preparing'}
                      {order.status === 'ready' && 'Ready for Pickup'}
                      {order.status === 'picked' && 'Out for Delivery'}
                      {order.status === 'delivered' && 'Delivered'}
                    </span>
                  </div>

                  {/* Progress Tracker */}
                  <div className="relative mb-12">
                    <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-200"></div>
                    <div
                      className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-orange-500 transition-all duration-500"
                      style={{ width: `${(stageIndex / (orderStages.length - 1)) * 100}%` }}
                    ></div>

                    <div className="relative flex justify-between">
                      {orderStages.map((stage, index) => {
                        const isActive = index <= stageIndex;
                        const Icon = stage.icon;

                        return (
                          <div key={stage.id} className="flex flex-col items-center">
                            <div
                              className={`z-10 w-10 h-10 flex items-center justify-center rounded-full ${
                                isActive ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                              }`}
                            >
                              <Icon size={18} />
                            </div>
                            <span className={`mt-2 text-sm font-medium ${
                              isActive ? 'text-orange-600' : 'text-gray-500'
                            }`}>
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Estimated Time */}
                  <div className="text-center mb-8">
                    <span className="text-gray-600">Estimated Delivery Time</span>
                    <div className="text-2xl font-semibold mt-1">
                      {order.estimatedDeliveryTime
                        ? formatDate(order.estimatedDeliveryTime)
                        : 'Calculating...'}
                    </div>
                  </div>

                  {/* Delivery Driver Info (if out for delivery) */}
                  {delivery && delivery.driver && (order.status === 'picked') && (
                    <div className="bg-orange-50 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold mb-3">Your Delivery Partner</h3>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                          {delivery.driver.photoUrl ? (
                            <img
                              src={delivery.driver.photoUrl}
                              alt={delivery.driver.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-orange-200 text-orange-800 font-bold">
                              {delivery.driver.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{delivery.driver.name}</p>
                          <p className="text-sm text-gray-600">Delivery Partner</p>
                        </div>
                        <div className="ml-auto">
                          <Button
                            variant="outline"
                            className="flex items-center"
                            onClick={handleCallDriver}
                          >
                            <FiPhone className="mr-2" />
                            <span>Call</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delivery Map */}
                  {order.status === 'picked' && mapMarkers.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">Live Tracking</h3>
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <MapComponent
                          center={mapCenter}
                          zoom={14}
                          markers={mapMarkers}
                          height="300px"
                          width="100%"
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {/* Delivery Address */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
                    <div className="flex items-start">
                      <FiMapPin className="text-orange-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{order.deliveryAddress.street}</p>
                        {order.deliveryAddress.apartment && (
                          <p>{order.deliveryAddress.apartment}</p>
                        )}
                        <p>
                          {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                        </p>
                        {order.deliveryAddress.instructions && (
                          <p className="text-sm text-gray-600 mt-2 italic">
                            "{order.deliveryAddress.instructions}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700">{order.restaurantName}</h3>
                    <p className="text-sm text-gray-500">Order placed: {formatDate(order.createdAt)}</p>
                  </div>

                  <div className="border-t border-b border-gray-200 py-4 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between mb-2">
                        <div>
                          <span className="font-medium">{item.quantity} x </span>
                          <span>{item.name}</span>
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-orange-600">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => orderService.cancelOrder(id)}
                      fullWidth
                    >
                      Cancel Order
                    </Button>
                  )}

                  {order.status === 'delivered' && (
                    <Button
                      onClick={() => navigate(`/orders/${id}/review`)}
                      fullWidth
                    >
                      Rate & Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">Order not found</div>
              <Button variant="outline" onClick={() => navigate('/orders')}>
                View All Orders
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderTrackingPage;