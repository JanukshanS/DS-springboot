import React from 'react';
import { FiStar, FiClock, FiPhone, FiMapPin, FiHeart, FiShare2 } from 'react-icons/fi';

const RestaurantHeader = ({ restaurant }) => {
  // Map API response fields to component expected fields
  const cuisine = restaurant.cuisineType || restaurant.cuisine || 'Various';
  const rating = restaurant.averageRating || restaurant.rating || 4.5;
  const priceLevel = restaurant.priceLevel || 2;
  const phone = restaurant.phoneNumber || restaurant.phone;

  return (
    <>
      {/* Restaurant Header/Banner */}
      <div className="h-64 md:h-80 bg-gray-300 relative">
        {restaurant.coverImageUrl || restaurant.imageUrl ? (
          <img
            src={restaurant.coverImageUrl || restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-500 text-white">
            <span className="text-3xl font-semibold">{restaurant.name}</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center text-white gap-x-6 gap-y-2">
              <div className="flex items-center">
                <FiStar className="text-yellow-400 mr-1" />
                <span>{rating}</span>
                <span className="ml-1 text-sm">({restaurant.reviewCount || restaurant.reviews?.length || 0}+ reviews)</span>
              </div>

              <div className="flex items-center">
                <span>{cuisine}</span>
              </div>

              <div className="flex items-center">
                <span>{'$'.repeat(priceLevel)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-4 text-gray-600 mb-2">
              <div className="flex items-center">
                <FiClock className="mr-1" />
                <span>{restaurant.deliveryTime || '30-45 min'}</span>
              </div>

              <div className="flex items-center">
                <FiMapPin className="mr-1" />
                <span>{restaurant.distance || '1.2 km away'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <FiPhone className="mr-1" />
                <span>{phone || '+1 (555) 123-4567'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              <FiHeart />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              <FiShare2 />
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-gray-600">
            {restaurant.description ||
              `${restaurant.name} offers delicious ${restaurant.cuisine} cuisine with a wide variety of
              options to satisfy all tastes. Our chefs use only the freshest ingredients to create
              authentic dishes that bring the true flavors to your table.`}
          </p>
        </div>
      </div>
    </>
  );
};

export default RestaurantHeader;