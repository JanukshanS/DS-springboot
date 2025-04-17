import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const RestaurantCard = ({ restaurant }) => {
  console.log('Restaurant Data:', restaurant.imageUrl);
  // Map API response fields to component expected fields
  const cuisine = restaurant.cuisineType || restaurant.cuisine || 'Various';
  const rating = restaurant.averageRating || restaurant.rating || 4.5;
  const priceLevel = restaurant.priceLevel || 2;

  // Check if the restaurant is active or inactive
  const isActive = restaurant.isActive;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg">
      <div
        className="h-48 bg-gray-200 relative bg-cover bg-center"
        style={{ backgroundImage: restaurant.imageUrl ? `url(${restaurant.imageUrl})` : 'none' }}
      >
        {!restaurant.imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
        <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm py-1 px-3 rounded-full flex items-center">
          <FiStar className="mr-1" /> {rating}
        </div>
        {/* Availability Icon */}
        <div className="absolute top-4 right-4 flex items-center">
          {isActive ? (
            <FiCheckCircle className="text-green-500" size={24} />
          ) : (
            <FiXCircle className="text-red-500" size={24} />
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-cabinet font-bold mb-2 truncate">{restaurant.name}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <span className="mr-2">{cuisine}</span>
          <span>•</span>
          <span className="mx-2 flex items-center">
            <FiClock className="mr-1" /> {restaurant.deliveryTime || '30-45 min'}
          </span>
          <span>•</span>
          <span className="ml-2">
            {'$'.repeat(priceLevel)}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {restaurant.description || 'Delicious meals prepared with fresh ingredients. Order now for a delightful culinary experience.'}
        </p>
        <Link
          to={`/restaurants/${restaurant.id}`}
          className="block w-full py-2 px-4 bg-white border border-orange-500 text-orange-500 rounded-md text-center font-semibold hover:bg-orange-50 transition-colors"
        >
          View Menu
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
