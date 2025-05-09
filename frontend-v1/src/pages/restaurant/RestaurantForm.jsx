import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserRestaurant, fetchUserProfile } from '../../store/slices/authSlice';
import { restaurant as restaurantAPI } from '../../services/api';

const RestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  
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

  // Fetch cuisine types on component mount
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
    if (id) {
      fetchRestaurantData();
    }
  }, [id]);

  const fetchRestaurantData = async () => {
    setIsLoading(true);
    try {
      const response = await restaurantAPI.getById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Failed to load restaurant data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const updateUserWithRestaurantId = async (restaurantId) => {
    try {
      console.log('Updating user profile with restaurant ID:', restaurantId);
      
      // Update the user profile with the restaurant ID using the Redux thunk
      const resultAction = await dispatch(updateUserRestaurant(restaurantId));
      
      if (updateUserRestaurant.fulfilled.match(resultAction)) {
        console.log('User profile updated successfully with restaurant ID');
        toast.success('Your profile has been updated with the restaurant ID');
        
        // Refresh user profile to ensure we have the latest data
        await dispatch(fetchUserProfile());
        return true;
      } else {
        console.error('Failed to update user profile:', resultAction.payload);
        throw new Error(resultAction.payload || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update your profile with the restaurant ID');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let response;
      
      if (id) {
        // Update existing restaurant
        console.log('Updating existing restaurant with ID:', id);
        response = await restaurantAPI.updateRestaurant(id, formData);
        console.log('Restaurant updated successfully:', response.data);
        toast.success('Restaurant updated successfully');
      } else {
        // Create new restaurant
        console.log('Creating new restaurant with data:', formData);
        response = await restaurantAPI.createRestaurant(formData);
        console.log('Restaurant created successfully:', response.data);
        toast.success('Restaurant created successfully');
        
        if (response.data && response.data.id) {
          console.log('Attempting to update user profile with restaurant ID:', response.data.id);
          // Update user profile with the new restaurant ID
          const updateSuccess = await updateUserWithRestaurantId(response.data.id);
          
          if (!updateSuccess) {
            console.warn('User profile update failed, but restaurant was created. You may need to manually link your account to this restaurant.');
            toast.warning('Restaurant created, but we couldn\'t update your profile. You may need to contact support.');
          }
        } else {
          console.error('Restaurant created but no ID returned:', response.data);
          toast.warning('Restaurant created, but we couldn\'t get its ID. You may need to contact support.');
        }
      }
      
      // Navigate to the restaurant dashboard
      const restaurantId = response.data.id;
      console.log('Navigating to restaurant dashboard:', restaurantId);
      navigate(`/restaurant-admin/${restaurantId}/dashboard`);
    } catch (error) {
      console.error('Error saving restaurant:', error);
      toast.error(error.response?.data?.message || 'Failed to save restaurant');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && id) {
    return <div className="p-4">Loading restaurant data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">
        {id ? 'Edit Restaurant' : 'Create New Restaurant'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Restaurant Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Cuisine Type */}
          <div>
            <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700 mb-1">
              Cuisine Type*
            </label>
            <select
              id="cuisineType"
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Cuisine Type</option>
              {cuisineTypes.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>
          
          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address*
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Opening Hours */}
          <div>
            <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-1">
              Opening Hours*
            </label>
            <input
              type="text"
              id="openingHours"
              name="openingHours"
              value={formData.openingHours}
              onChange={handleChange}
              placeholder="e.g., Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          
          {/* Active Status */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Restaurant is active and visible to customers
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading ? 'Saving...' : 'Save Restaurant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantForm;
