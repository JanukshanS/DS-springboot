import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiEdit2, FiCheck, FiX, FiSave, FiClock, FiDollarSign, FiMapPin, FiPhone, FiMail, FiGlobe, FiUser } from 'react-icons/fi';
import { restaurant as restaurantService } from '../../services/api';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  
  // Edit states
  const [isEditing, setIsEditing] = useState({
    general: false,
    hours: false,
    delivery: false
  });
  
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cuisine: '',
    deliveryRadius: '',
    minimumOrderAmount: '',
    deliveryFee: '',
    averagePreparationTime: '',
    schedule: []
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        const response = await restaurantService.getRestaurantProfile();
        
        // Mock data for development
        const mockRestaurant = {
          id: '123',
          name: 'Italian Delight',
          description: 'Authentic Italian cuisine with a modern twist. We use only the freshest ingredients to create memorable dishes.',
          phone: '(123) 456-7890',
          email: 'contact@italiandelight.com',
          website: 'www.italiandelight.com',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          cuisine: 'Italian',
          rating: 4.7,
          reviewsCount: 243,
          priceRange: '$$',
          deliveryRadius: 5,
          minimumOrderAmount: 15,
          deliveryFee: 3.99,
          averagePreparationTime: 25,
          schedule: [
            { day: 'Monday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
            { day: 'Tuesday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
            { day: 'Wednesday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
            { day: 'Thursday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
            { day: 'Friday', isOpen: true, openTime: '11:00', closeTime: '23:00' },
            { day: 'Saturday', isOpen: true, openTime: '12:00', closeTime: '23:00' },
            { day: 'Sunday', isOpen: true, openTime: '12:00', closeTime: '22:00' }
          ],
          profileImage: null,
          coverImage: null
        };
        
        setRestaurant(response?.data || mockRestaurant);
        
        // Initialize edit data
        setEditData({
          name: mockRestaurant.name,
          description: mockRestaurant.description,
          phone: mockRestaurant.phone,
          email: mockRestaurant.email,
          website: mockRestaurant.website,
          address: mockRestaurant.address,
          city: mockRestaurant.city,
          state: mockRestaurant.state,
          zipCode: mockRestaurant.zipCode,
          cuisine: mockRestaurant.cuisine,
          deliveryRadius: mockRestaurant.deliveryRadius.toString(),
          minimumOrderAmount: mockRestaurant.minimumOrderAmount.toString(),
          deliveryFee: mockRestaurant.deliveryFee.toString(),
          averagePreparationTime: mockRestaurant.averagePreparationTime.toString(),
          schedule: [...mockRestaurant.schedule]
        });
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        toast.error('Failed to load restaurant settings');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleScheduleChange = (day, field, value) => {
    const updatedSchedule = editData.schedule.map(item => {
      if (item.day === day) {
        if (field === 'isOpen') {
          return { ...item, [field]: value };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    
    setEditData({
      ...editData,
      schedule: updatedSchedule
    });
  };

  const handleStartEditing = (section) => {
    setIsEditing({
      ...isEditing,
      [section]: true
    });
  };

  const handleCancelEditing = (section) => {
    // Reset form data to original values
    if (restaurant) {
      setEditData({
        name: restaurant.name,
        description: restaurant.description,
        phone: restaurant.phone,
        email: restaurant.email,
        website: restaurant.website,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        zipCode: restaurant.zipCode,
        cuisine: restaurant.cuisine,
        deliveryRadius: restaurant.deliveryRadius.toString(),
        minimumOrderAmount: restaurant.minimumOrderAmount.toString(),
        deliveryFee: restaurant.deliveryFee.toString(),
        averagePreparationTime: restaurant.averagePreparationTime.toString(),
        schedule: [...restaurant.schedule]
      });
    }
    
    setIsEditing({
      ...isEditing,
      [section]: false
    });
  };

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    
    try {
      setSaveLoading(true);
      
      // In a real app, you would call your API
      // const response = await restaurantService.updateProfile({
      //   name: editData.name,
      //   description: editData.description,
      //   phone: editData.phone,
      //   email: editData.email,
      //   website: editData.website,
      //   address: editData.address,
      //   city: editData.city,
      //   state: editData.state,
      //   zipCode: editData.zipCode,
      //   cuisine: editData.cuisine
      // });
      
      // Update local state
      setRestaurant({
        ...restaurant,
        name: editData.name,
        description: editData.description,
        phone: editData.phone,
        email: editData.email,
        website: editData.website,
        address: editData.address,
        city: editData.city,
        state: editData.state,
        zipCode: editData.zipCode,
        cuisine: editData.cuisine
      });
      
      toast.success('General settings updated successfully');
      setIsEditing({
        ...isEditing,
        general: false
      });
    } catch (error) {
      console.error('Error updating restaurant profile:', error);
      toast.error('Failed to update restaurant profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveHours = async (e) => {
    e.preventDefault();
    
    try {
      setSaveLoading(true);
      
      // In a real app, you would call your API
      // const response = await restaurantService.updateBusinessHours({
      //   schedule: editData.schedule
      // });
      
      // Update local state
      setRestaurant({
        ...restaurant,
        schedule: [...editData.schedule]
      });
      
      toast.success('Business hours updated successfully');
      setIsEditing({
        ...isEditing,
        hours: false
      });
    } catch (error) {
      console.error('Error updating business hours:', error);
      toast.error('Failed to update business hours');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveDelivery = async (e) => {
    e.preventDefault();
    
    try {
      setSaveLoading(true);
      
      const deliveryRadius = parseFloat(editData.deliveryRadius);
      const minimumOrderAmount = parseFloat(editData.minimumOrderAmount);
      const deliveryFee = parseFloat(editData.deliveryFee);
      const averagePreparationTime = parseInt(editData.averagePreparationTime);
      
      if (isNaN(deliveryRadius) || deliveryRadius <= 0) {
        toast.error('Please enter a valid delivery radius');
        return;
      }
      
      if (isNaN(minimumOrderAmount) || minimumOrderAmount < 0) {
        toast.error('Please enter a valid minimum order amount');
        return;
      }
      
      if (isNaN(deliveryFee) || deliveryFee < 0) {
        toast.error('Please enter a valid delivery fee');
        return;
      }
      
      if (isNaN(averagePreparationTime) || averagePreparationTime <= 0) {
        toast.error('Please enter a valid preparation time');
        return;
      }
      
      // In a real app, you would call your API
      // const response = await restaurantService.updateDeliverySettings({
      //   deliveryRadius,
      //   minimumOrderAmount,
      //   deliveryFee,
      //   averagePreparationTime
      // });
      
      // Update local state
      setRestaurant({
        ...restaurant,
        deliveryRadius,
        minimumOrderAmount,
        deliveryFee,
        averagePreparationTime
      });
      
      toast.success('Delivery settings updated successfully');
      setIsEditing({
        ...isEditing,
        delivery: false
      });
    } catch (error) {
      console.error('Error updating delivery settings:', error);
      toast.error('Failed to update delivery settings');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Restaurant Settings</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : restaurant ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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

          {/* General Information */}
          {activeTab === 'general' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">General Information</h2>
                {!isEditing.general ? (
                  <Button
                    onClick={() => handleStartEditing('general')}
                    variant="outline"
                    className="flex items-center"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleCancelEditing('general')}
                      variant="outline"
                      className="flex items-center"
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {isEditing.general ? (
                <form onSubmit={handleSaveGeneral}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                        <FiUser className="inline mr-1" /> Restaurant Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="cuisine" className="block text-gray-700 text-sm font-medium mb-2">
                        Cuisine Type
                      </label>
                      <input
                        type="text"
                        id="cuisine"
                        name="cuisine"
                        value={editData.cuisine}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={editData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                        <FiPhone className="inline mr-1" /> Phone Number*
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={editData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                        <FiMail className="inline mr-1" /> Email*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-gray-700 text-sm font-medium mb-2">
                        <FiGlobe className="inline mr-1" /> Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={editData.website}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-gray-700 font-medium mb-2">Location</h3>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-2">
                        <FiMapPin className="inline mr-1" /> Street Address*
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={editData.address}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2">
                        City*
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={editData.city}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-gray-700 text-sm font-medium mb-2">
                        State/Province*
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={editData.state}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-gray-700 text-sm font-medium mb-2">
                        Zip/Postal Code*
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={editData.zipCode}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button type="submit" disabled={saveLoading}>
                      {saveLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Restaurant Name</h3>
                      <p className="mt-1 text-sm text-gray-900">{restaurant.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Cuisine Type</h3>
                      <p className="mt-1 text-sm text-gray-900">{restaurant.cuisine || 'Not specified'}</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1 text-sm text-gray-900">{restaurant.description || 'No description provided'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                      <p className="mt-1 text-sm text-gray-900">{restaurant.phone}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-sm text-gray-900">{restaurant.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Website</h3>
                      <p className="mt-1 text-sm text-gray-900">{restaurant.website || 'Not specified'}</p>
                    </div>
                    
                    <div className="md:col-span-2 mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {restaurant.address}, {restaurant.city}, {restaurant.state} {restaurant.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Business Hours */}
          {activeTab === 'hours' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Business Hours</h2>
                {!isEditing.hours ? (
                  <Button
                    onClick={() => handleStartEditing('hours')}
                    variant="outline"
                    className="flex items-center"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleCancelEditing('hours')}
                      variant="outline"
                      className="flex items-center"
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {isEditing.hours ? (
                <form onSubmit={handleSaveHours}>
                  <div className="space-y-4">
                    {daysOfWeek.map((day) => {
                      const daySchedule = editData.schedule.find(item => item.day === day) || {
                        day,
                        isOpen: false,
                        openTime: '09:00',
                        closeTime: '17:00'
                      };
                      
                      return (
                        <div key={day} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-md">
                          <div className="w-28">
                            <span className="text-sm font-medium text-gray-700">{day}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`isOpen-${day}`}
                              checked={daySchedule.isOpen}
                              onChange={(e) => handleScheduleChange(day, 'isOpen', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <label htmlFor={`isOpen-${day}`} className="ml-2 block text-sm text-gray-700">
                              Open
                            </label>
                          </div>
                          
                          {daySchedule.isOpen && (
                            <>
                              <div className="flex items-center">
                                <label htmlFor={`openTime-${day}`} className="block text-sm text-gray-700 mr-2">
                                  From
                                </label>
                                <input
                                  type="time"
                                  id={`openTime-${day}`}
                                  value={daySchedule.openTime}
                                  onChange={(e) => handleScheduleChange(day, 'openTime', e.target.value)}
                                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                              </div>
                              
                              <div className="flex items-center">
                                <label htmlFor={`closeTime-${day}`} className="block text-sm text-gray-700 mr-2">
                                  To
                                </label>
                                <input
                                  type="time"
                                  id={`closeTime-${day}`}
                                  value={daySchedule.closeTime}
                                  onChange={(e) => handleScheduleChange(day, 'closeTime', e.target.value)}
                                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8">
                    <Button type="submit" disabled={saveLoading}>
                      {saveLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {daysOfWeek.map((day) => {
                    const daySchedule = restaurant.schedule.find(item => item.day === day);
                    
                    return (
                      <div key={day} className="flex items-center p-3 border border-gray-200 rounded-md">
                        <div className="w-28">
                          <span className="text-sm font-medium text-gray-700">{day}</span>
                        </div>
                        
                        {daySchedule?.isOpen ? (
                          <div className="flex items-center text-sm text-gray-900">
                            <FiClock className="text-gray-400 mr-2" />
                            <span>
                              {daySchedule.openTime} - {daySchedule.closeTime}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-red-600">Closed</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Delivery Settings */}
          {activeTab === 'delivery' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Delivery Settings</h2>
                {!isEditing.delivery ? (
                  <Button
                    onClick={() => handleStartEditing('delivery')}
                    variant="outline"
                    className="flex items-center"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleCancelEditing('delivery')}
                      variant="outline"
                      className="flex items-center"
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {isEditing.delivery ? (
                <form onSubmit={handleSaveDelivery}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="deliveryRadius" className="block text-gray-700 text-sm font-medium mb-2">
                        Delivery Radius (miles)*
                      </label>
                      <input
                        type="number"
                        id="deliveryRadius"
                        name="deliveryRadius"
                        value={editData.deliveryRadius}
                        onChange={handleChange}
                        min="0.1"
                        step="0.1"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">Maximum distance for delivery in miles</p>
                    </div>

                    <div>
                      <label htmlFor="minimumOrderAmount" className="block text-gray-700 text-sm font-medium mb-2">
                        <FiDollarSign className="inline mr-1" /> Minimum Order Amount ($)
                      </label>
                      <input
                        type="number"
                        id="minimumOrderAmount"
                        name="minimumOrderAmount"
                        value={editData.minimumOrderAmount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Minimum order amount required for delivery</p>
                    </div>

                    <div>
                      <label htmlFor="deliveryFee" className="block text-gray-700 text-sm font-medium mb-2">
                        <FiDollarSign className="inline mr-1" /> Delivery Fee ($)
                      </label>
                      <input
                        type="number"
                        id="deliveryFee"
                        name="deliveryFee"
                        value={editData.deliveryFee}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Fee charged for delivery</p>
                    </div>

                    <div>
                      <label htmlFor="averagePreparationTime" className="block text-gray-700 text-sm font-medium mb-2">
                        <FiClock className="inline mr-1" /> Average Preparation Time (minutes)
                      </label>
                      <input
                        type="number"
                        id="averagePreparationTime"
                        name="averagePreparationTime"
                        value={editData.averagePreparationTime}
                        onChange={handleChange}
                        min="1"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Average time to prepare an order</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button type="submit" disabled={saveLoading}>
                      {saveLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Delivery Radius</h3>
                    <p className="mt-1 text-sm text-gray-900">{restaurant.deliveryRadius} miles</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Minimum Order Amount</h3>
                    <p className="mt-1 text-sm text-gray-900">${restaurant.minimumOrderAmount.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Delivery Fee</h3>
                    <p className="mt-1 text-sm text-gray-900">${restaurant.deliveryFee.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Average Preparation Time</h3>
                    <p className="mt-1 text-sm text-gray-900">{restaurant.averagePreparationTime} minutes</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Restaurant Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to load your restaurant profile. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;