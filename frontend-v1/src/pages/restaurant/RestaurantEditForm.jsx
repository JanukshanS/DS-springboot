import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { fetchRestaurantDetails } from '../../store/slices/restaurantSlice';
import { restaurant as restaurantAPI } from '../../services/api';

const RestaurantEditForm = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRestaurant, loading } = useSelector((state) => state.restaurants);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [isNewCuisine, setIsNewCuisine] = useState(false);
  const [customCuisine, setCustomCuisine] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    description: '',
    cuisineType: '',
    openingHours: '',
    imageUrl: '',
    isActive: true
  });

  // Fetch cuisine types and restaurant details on component mount
  useEffect(() => {
    const fetchCuisineTypes = async () => {
      try {
        const response = await restaurantAPI.getCuisines();
        setCuisineTypes(response.data);
      } catch (error) {
        console.error('Error fetching cuisine types:', error);
        toast.error('Failed to load cuisine types');
      }
    };

    fetchCuisineTypes();
    
    // If editing an existing restaurant, fetch its data
    if (restaurantId) {
      dispatch(fetchRestaurantDetails({ id: restaurantId, isDashboard: true }));
    }
  }, [dispatch, restaurantId]);

  // Update form when restaurant data is loaded
  useEffect(() => {
    if (currentRestaurant) {
      setFormData({
        name: currentRestaurant.name || '',
        address: currentRestaurant.address || '',
        phoneNumber: currentRestaurant.phoneNumber || '',
        email: currentRestaurant.email || '',
        description: currentRestaurant.description || '',
        cuisineType: currentRestaurant.cuisineType || '',
        openingHours: currentRestaurant.openingHours || '',
        imageUrl: currentRestaurant.imageUrl || '',
        isActive: currentRestaurant.isActive !== undefined ? currentRestaurant.isActive : true
      });
    }
  }, [currentRestaurant]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'cuisineType' && value === 'new') {
      setIsNewCuisine(true);
    } else if (name === 'customCuisine') {
      setCustomCuisine(value);
      setFormData(prev => ({ ...prev, cuisineType: value }));
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
      
      // If changing cuisine back to a predefined one, reset custom cuisine state
      if (name === 'cuisineType' && isNewCuisine) {
        setIsNewCuisine(false);
        setCustomCuisine('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Update existing restaurant
      const response = await restaurantAPI.updateRestaurant(restaurantId, formData);
      console.log('Restaurant updated successfully:', response.data);
      toast.success('Restaurant updated successfully');
      
      // Refresh restaurant details
      dispatch(fetchRestaurantDetails({ id: restaurantId, isDashboard: true }));
      
      // Navigate back to settings page
      navigate(`/restaurant-admin/${restaurantId}/settings`);
    } catch (error) {
      console.error('Error saving restaurant:', error);
      toast.error(error.response?.data?.message || 'Failed to save restaurant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/restaurant-admin/${restaurantId}/settings`);
  };

  if (loading && !currentRestaurant) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={handleCancel}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <FiArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold">Edit Restaurant</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
        {/* Restaurant Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Restaurant Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
        
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>
        
        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
        
        {/* Cuisine Type */}
        <div>
          <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700">
            Cuisine Type *
          </label>
          
          {!isNewCuisine ? (
            <select
              id="cuisineType"
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="">Select a cuisine type</option>
              {cuisineTypes.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
              <option value="new" className="font-medium text-blue-600">+ Add new cuisine type</option>
            </select>
          ) : (
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="customCuisine"
                name="customCuisine"
                value={customCuisine}
                onChange={handleChange}
                placeholder="Enter new cuisine type"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => {
                  setIsNewCuisine(false);
                  if (!customCuisine.trim()) {
                    setFormData(prev => ({ ...prev, cuisineType: '' }));
                  }
                }}
                className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        {/* Opening Hours */}
        <div>
          <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700">
            Opening Hours
          </label>
          <input
            type="text"
            id="openingHours"
            name="openingHours"
            value={formData.openingHours}
            onChange={handleChange}
            placeholder="e.g., Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
        
        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Restaurant is currently active and accepting orders
          </label>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Saving...</span>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              </>
            ) : (
              <>
                <FiSave className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantEditForm;
