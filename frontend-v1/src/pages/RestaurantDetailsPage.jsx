import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantDetails, clearRestaurant } from '../store/slices/restaurantSlice';

import { addItem } from '../store/slices/cartSlice';
import { StarIcon, MapPinIcon, ClockIcon, PhoneIcon } from '@heroicons/react/24/solid';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRestaurant, loading, error } = useSelector((state) => state.restaurants);
  const { items, restaurantId } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // State for active category tab
  const [activeCategory, setActiveCategory] = useState(null);

  // Fetch restaurant details when component mounts or ID changes
  useEffect(() => {
    console.log('Fetching restaurant details for ID:', id);
    dispatch(fetchRestaurantDetails(id));

    // Cleanup when component unmounts
    return () => {
      dispatch(clearRestaurant());
    };
  }, [dispatch, id]);

  // Set active category when restaurant data is loaded
  useEffect(() => {
    if (currentRestaurant?.menuItems?.length > 0) {
      // Extract unique categories from menu items
      const categories = [...new Set(currentRestaurant.menuItems.map(item => item.category))];
      if (categories.length > 0) {
        setActiveCategory(categories[0]);
      }
    }
  }, [currentRestaurant]);

  // Filter menu items by active category
  const filteredMenuItems = currentRestaurant?.menuItems?.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  // Handle adding item to cart
  const handleAddToCart = (item) => {
    // Check if authenticated
    if (!isAuthenticated) {
      // Save the current page URL to redirect back after login
      navigate(`/login?redirect=${encodeURIComponent(`/restaurants/${id}`)}`);
      return;
    }

    // Check if item is from a different restaurant
    if (restaurantId && restaurantId !== currentRestaurant.id) {
      // Confirm before clearing cart
      if (window.confirm('Your cart contains items from a different restaurant. Clear cart and add this item?')) {
        // Clear cart and add new item
        dispatch({ type: 'cart/clearCart' });
        addItemToCart(item);
      }
    } else {
      // Add item directly if cart is empty or from same restaurant
      addItemToCart(item);
    }
  };

  // Helper function to add item and show toast
  const addItemToCart = (item) => {
    dispatch(
      addItem({
        restaurantId: currentRestaurant.id,
        restaurantName: currentRestaurant.name,
        item: {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
        },
      })
    );
    toast.success(`${item.name} added to cart!`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Error Loading Restaurant
          </h2>
          <p className="mt-4 text-lg text-gray-500">{error}</p>
          <div className="mt-6">
            <Button onClick={() => navigate('/restaurants')}>
              Back to Restaurants
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!currentRestaurant) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Restaurant Not Found
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            The restaurant you're looking for might have been removed or is temporarily unavailable.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate('/restaurants')}>
              Browse Other Restaurants
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate average rating
  const avgRating = currentRestaurant.rating || 0;

  return (
    <div className="bg-white">
      {/* Hero section with restaurant image */}
      <div className="relative h-64 sm:h-96">
        <img
          src={currentRestaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'}
          alt={currentRestaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {currentRestaurant.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Restaurant info section */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurant Info</h2>

            <div className="space-y-4">
              {/* Rating */}
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={`${
                        avgRating > rating ? 'text-yellow-400' : 'text-gray-300'
                      } h-5 w-5 flex-shrink-0`}
                    />
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-700">
                  {avgRating.toFixed(1)} ({currentRestaurant.reviewCount || 0} reviews)
                </p>
              </div>

              {/* Cuisine */}
              <div>
                <p className="text-sm font-medium text-gray-500">Cuisine</p>
                <p className="text-base text-gray-900">
                  {currentRestaurant.cuisine || 'Various Cuisines'}
                </p>
              </div>

              {/* Address */}
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <p className="text-sm text-gray-700">
                  {currentRestaurant.address || 'Address not available'}
                </p>
              </div>

              {/* Hours */}
              <div className="flex items-start">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    Hours: {currentRestaurant.openingHours || '9:00 AM - 10:00 PM'}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    {currentRestaurant.isOpen ? 'Open Now' : 'Closed'}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <p className="text-sm text-gray-700">
                  {currentRestaurant.phone || 'Phone not available'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu section */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>

            {/* Category tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`${
                    activeCategory === 'all'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-3 px-5 border-b-2 font-medium text-sm`}
                >
                  All Items
                </button>
                {currentRestaurant.menuItems && [...new Set(currentRestaurant.menuItems.map(item => item.category))].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`${
                      activeCategory === category
                        ? 'border-orange-500 text-orange-500'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-5 border-b-2 font-medium text-sm`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu items */}
            {filteredMenuItems?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4 flex-grow">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {item.description || 'No description available'}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-lg font-medium text-gray-900">
                          ${parseFloat(item.price).toFixed(2)}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No menu items available in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsPage;