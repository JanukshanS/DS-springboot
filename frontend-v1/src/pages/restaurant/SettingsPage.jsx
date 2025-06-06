import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiSettings, FiMapPin, FiPhone, FiMail, FiGlobe, FiClock, FiUpload, FiImage, FiCheck } from 'react-icons/fi';
import { fetchRestaurantDetails, updateRestaurant } from '../../store/slices/restaurantSlice';
import toast from 'react-hot-toast';
import { uploadImage } from '../../services/ImageService';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const { currentRestaurant, loading } = useSelector((state) => state.restaurants);
  const [activeTab, setActiveTab] = useState('general');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Upload image to Cloudinary and update restaurant
  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error('Please select an image first');
      return;
    }
    
    try {
      setUploading(true);
      
      // Step 1: Upload the image to Cloudinary using our service
      const imageUrl = await uploadImage(imageFile, 'restaurant_images');
      
      if (!imageUrl) {
        throw new Error('Failed to get image URL from Cloudinary');
      }
      
      // Step 2: Make sure we have the current restaurant data
      if (!currentRestaurant) {
        throw new Error('Restaurant data not found');
      }
      
      // Step 3: Create a copy of the current restaurant data and update only the imageUrl
      const updatedRestaurantData = {
        // Copy all existing fields to preserve them
        name: currentRestaurant.name || '',
        description: currentRestaurant.description || '',
        address: currentRestaurant.address || '',
        phoneNumber: currentRestaurant.phoneNumber || '',
        email: currentRestaurant.email || '',
        cuisineType: currentRestaurant.cuisineType || '',
        openingHours: currentRestaurant.openingHours || '',
        averageRating: currentRestaurant.averageRating,
        isActive: currentRestaurant.isActive,
        
        // Update only the image URL with the Cloudinary URL
        imageUrl: imageUrl
      };
      
      // Step 4: Update the restaurant with all fields preserved
      await dispatch(updateRestaurant({
        id: restaurantId,
        restaurantData: updatedRestaurantData
      })).unwrap();
      
      toast.success('Restaurant image updated successfully');
      setImageFile(null);
      setPreviewUrl('');
      
      // Step 5: Refresh restaurant details to show the updated image
      dispatch(fetchRestaurantDetails({ id: restaurantId, isDashboard: true }));
    } catch (error) {
      console.error('Error updating restaurant image:', error);
      toast.error(error.message || 'Failed to update restaurant image');
    } finally {
      setUploading(false);
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
      
      {/* Image Upload Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Restaurant Image</h3>
        
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Current Image or Preview */}
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-48 w-full flex items-center justify-center">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : currentRestaurant?.imageUrl ? (
                <img 
                  src={currentRestaurant.imageUrl} 
                  alt={currentRestaurant.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiImage className="h-16 w-16 text-gray-400" />
              )}
            </div>
          </div>
          
          {/* Upload Controls */}
          <div className="w-full md:w-2/3">
            <p className="text-gray-600 mb-4">
              Upload a high-quality image of your restaurant. This image will be displayed to customers browsing the platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <button
                onClick={handleUploadClick}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                <FiUpload className="h-5 w-5" />
                Select Image
              </button>
              
              {imageFile && (
                <button
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiCheck className="h-5 w-5" />
                      Upload & Save
                    </>
                  )}
                </button>
              )}
            </div>
            
            {imageFile && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
              </p>
            )}
          </div>
        </div>
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
