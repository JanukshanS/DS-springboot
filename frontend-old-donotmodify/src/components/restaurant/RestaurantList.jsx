import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantService } from '../../services/api';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantService.getAllRestaurants();
        setRestaurants(response.data);
      } catch (err) {
        setError('Failed to fetch restaurants. Please try again later.');
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={restaurant.imageUrl || 'https://via.placeholder.com/400x200?text=Restaurant'} 
              alt={restaurant.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
              <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
              <p className="text-gray-500 text-sm mb-4">{restaurant.address}</p>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(restaurant.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 ml-2">{restaurant.rating.toFixed(1)}</span>
              </div>
              <Link 
                to={`/restaurants/${restaurant.id}`}
                className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
              >
                View Menu
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {restaurants.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No restaurants found.</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
