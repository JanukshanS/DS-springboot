import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { restaurantService, authService } from '../../services/api';
import {
  addItem,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  setRestaurant,
  selectCartItems,
  selectCartTotalAmount
} from '../../store/slices/cartSlice';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMounted = useRef(true);

  // Use Redux state instead of local state for cart
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotalAmount);

  // Local component state
  const [restaurant, setRestaurantData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const currentUser = authService.getCurrentUser();

  // Ref to track first render and prevent infinite loops
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      if (!isMounted.current) return;

      try {
        setLoading(true);
        const restaurantResponse = await restaurantService.getRestaurantById(id);

        // Only update state if component is still mounted
        if (!isMounted.current) return;

        const restaurantData = restaurantResponse.data;
        setRestaurantData(restaurantData);

        // Store restaurant in Redux for cart context
        dispatch(setRestaurant(restaurantData));

        const menuResponse = await restaurantService.getMenuItems(id);

        // Only update state if component is still mounted
        if (!isMounted.current) return;

        setMenuItems(menuResponse.data);
      } catch (err) {
        if (isMounted.current) {
          setError('Failed to fetch restaurant details. Please try again later.');
          console.error('Error fetching restaurant details:', err);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchRestaurantAndMenu();
  }, [id, dispatch]);

  const categories = menuItems.length > 0
    ? ['All', ...new Set(menuItems.map(item => item.category))]
    : ['All'];

  const filteredMenuItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  // Redux-connected cart functions
  const handleAddToCart = (menuItem) => {
    dispatch(addItem({ item: menuItem }));
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(decrementQuantity({ itemId }));
  };

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white bg-opacity-5 rounded-xl overflow-hidden shadow-lg border border-gray-800 mb-8">
        <div className="relative">
          <img
            src={restaurant?.imageUrl || 'https://via.placeholder.com/1200x400?text=Restaurant'}
            alt={restaurant?.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{restaurant?.name}</h1>
              <p className="text-lg mb-2">{restaurant?.cuisine}</p>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(restaurant?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2">{restaurant?.rating?.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-300 mb-4">{restaurant?.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div>
              <span className="font-semibold">Address:</span> {restaurant?.address}
            </div>
            <div>
              <span className="font-semibold">Phone:</span> {restaurant?.phoneNumber}
            </div>
            <div>
              <span className="font-semibold">Hours:</span> {restaurant?.openingHours}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Menu</h2>
            <div className="flex overflow-x-auto pb-2 mb-4">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 mr-2 rounded-full whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenuItems.map(menuItem => (
              <div key={menuItem.id} className="bg-white bg-opacity-5 rounded-lg shadow-md border border-gray-800 p-4 flex">
                {menuItem.imageUrl && (
                  <img
                    src={menuItem.imageUrl}
                    alt={menuItem.name}
                    className="w-24 h-24 object-cover rounded mr-4"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-white">{menuItem.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{menuItem.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-400">${menuItem.price.toFixed(2)}</span>
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                      onClick={() => handleAddToCart(menuItem)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredMenuItems.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">No menu items found in this category.</p>
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="bg-white bg-opacity-5 rounded-xl overflow-hidden shadow-lg border border-gray-800 p-4 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Your Order</h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Your cart is empty</p>
            ) : (
              <>
                <div className="mb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                      <div>
                        <h4 className="font-medium text-white">{item.name}</h4>
                        <div className="flex items-center mt-1">
                          <button
                            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            -
                          </button>
                          <span className="mx-2 text-gray-300">{item.quantity}</span>
                          <button
                            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            onClick={() => handleAddToCart(item)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span className="font-medium text-indigo-400">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span>Total:</span>
                    <span className="text-indigo-400">${cartTotal.toFixed(2)}</span>
                  </div>

                  <button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
