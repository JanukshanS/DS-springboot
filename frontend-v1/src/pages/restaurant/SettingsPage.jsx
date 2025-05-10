import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiSettings, FiMapPin, FiPhone, FiMail, FiGlobe, FiClock } from 'react-icons/fi';
import { fetchRestaurantDetails } from '../../store/slices/restaurantSlice';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const { currentRestaurant, loading } = useSelector((state) => state.restaurants);
  const [activeTab, setActiveTab] = useState('general');

  // Fetch restaurant details when component mounts
  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantDetails({ id: restaurantId, isDashboard: true }));
    }
  }, [dispatch, restaurantId]);

  // Navigate to the restaurant edit form
  const handleEditRestaurant = () => {
    if (restaurantId) {
      navigate(`/restaurant-admin/manage/${restaurantId}/edit`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Restaurant Settings</h2>
        
        <button 
          onClick={handleEditRestaurant}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          <FiEdit2 className="h-5 w-5" />
          Edit Restaurant Profile
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : currentRestaurant ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'general'
                    ? 'border-b-2 border-orange-500 text-orange-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('general')}
              >
                General Information
              </button>
              <button
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'hours'
                    ? 'border-b-2 border-orange-500 text-orange-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('hours')}
              >
                Business Hours
              </button>
              <button
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'delivery'
                    ? 'border-b-2 border-orange-500 text-orange-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('delivery')}
              >
                Delivery Settings
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <FiSettings className="h-5 w-5 text-gray-500 mr-3" />
                  <h3 className="text-lg font-medium">Restaurant Information</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex items-start">
                    <FiGlobe className="h-5 w-5 text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Restaurant Name</p>
                      <p className="text-base">{currentRestaurant.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiMapPin className="h-5 w-5 text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-base">{currentRestaurant.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiPhone className="h-5 w-5 text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="text-base">{currentRestaurant.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiMail className="h-5 w-5 text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base">{currentRestaurant.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiSettings className="h-5 w-5 text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cuisine Type</p>
                      <p className="text-base">{currentRestaurant.cuisineType}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleEditRestaurant}
                    className="flex items-center text-orange-600 hover:text-orange-700"
                  >
                    <FiEdit2 className="h-4 w-4 mr-1" />
                    Edit Information
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'hours' && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <FiClock className="h-5 w-5 text-gray-500 mr-3" />
                  <h3 className="text-lg font-medium">Business Hours</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-base mb-4">{currentRestaurant.openingHours || 'No business hours set'}</p>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleEditRestaurant}
                      className="flex items-center text-orange-600 hover:text-orange-700"
                    >
                      <FiEdit2 className="h-4 w-4 mr-1" />
                      Edit Hours
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'delivery' && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <FiSettings className="h-5 w-5 text-gray-500 mr-3" />
                  <h3 className="text-lg font-medium">Delivery Settings</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Delivery Radius</p>
                      <p className="text-base">{currentRestaurant.deliveryRadius || 'Not set'} miles</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Minimum Order</p>
                      <p className="text-base">${currentRestaurant.minimumOrderAmount || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Delivery Fee</p>
                      <p className="text-base">${currentRestaurant.deliveryFee || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Average Preparation Time</p>
                      <p className="text-base">{currentRestaurant.averagePreparationTime || 'Not set'} minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleEditRestaurant}
                      className="flex items-center text-orange-600 hover:text-orange-700"
                    >
                      <FiEdit2 className="h-4 w-4 mr-1" />
                      Edit Delivery Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Restaurant information not found. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
