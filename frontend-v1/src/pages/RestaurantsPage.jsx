import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiStar, FiClock, FiFilter, FiSearch } from 'react-icons/fi';
import {
  fetchRestaurants,
  setFilters,
  clearFilters,
  setPage,
} from "../store/slices/restaurantSlice";
import { restaurant } from '../services/api';
import Button from '../components/common/Button';

const RestaurantsPage = () => {
  const dispatch = useDispatch();
  const { restaurants, loading, error, filters, pagination } = useSelector(
    (state) => state.restaurants
  );

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [loadingCuisines, setLoadingCuisines] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    cuisine: '',
    priceLevel: '',
    rating: ''
  });

  // Fetch cuisine types from the backend
  useEffect(() => {
    const fetchCuisineTypes = async () => {
      try {
        setLoadingCuisines(true);
        const response = await restaurant.getAllCuisines();
        if (response.data && Array.isArray(response.data)) {
          setCuisineTypes(response.data);
          console.log('Fetched cuisine types:', response.data);
        }
      } catch (error) {
        console.error('Error fetching cuisine types:', error);
        // Fallback to default cuisine types if the API call fails
        setCuisineTypes([
          'Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese',
          'Thai', 'American', 'Mediterranean', 'Greek', 'French'
        ]);
      } finally {
        setLoadingCuisines(false);
      }
    };

    fetchCuisineTypes();
  }, []);

  useEffect(() => {
    const params = {
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
      search: searchTerm
    };

    dispatch(fetchRestaurants(params));
  }, [dispatch, filters, pagination.page, pagination.limit, searchTerm]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: value
    });
  };

  const applyFilters = () => {
    console.log('Applying filters:', localFilters);
    // Create an object with only the non-empty filters
    const filtersToApply = {};
    
    if (localFilters.cuisine) {
      filtersToApply.cuisine = localFilters.cuisine;
    }
    
    if (localFilters.priceLevel) {
      filtersToApply.priceLevel = localFilters.priceLevel;
    }
    
    if (localFilters.rating) {
      filtersToApply.rating = Number(localFilters.rating);
    }
    
    console.log('Filters being applied:', filtersToApply);
    dispatch(setFilters(filtersToApply));
    
    // Reset page to 1 when applying filters
    dispatch(setPage(1));
    setShowFilters(false);
  };

  const resetFilters = () => {
    setLocalFilters({
      cuisine: '',
      priceLevel: '',
      rating: ''
    });
    dispatch(clearFilters());
    setShowFilters(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // The search will trigger due to the useEffect watching searchTerm
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-rowdies font-bold text-gray-800 mb-4 md:mb-0">
            Restaurants
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full sm:w-auto"
            >
              <input
                type="text"
                placeholder="Search restaurants..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </form>
            <Button
              onClick={toggleFilters}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FiFilter /> Filters
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="cuisine"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Cuisine
                </label>
                <select
                  id="cuisine"
                  name="cuisine"
                  value={localFilters.cuisine}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  disabled={loadingCuisines}
                >
                  <option value="">All Cuisines</option>
                  {loadingCuisines ? (
                    <option value="" disabled>Loading cuisines...</option>
                  ) : (
                    cuisineTypes.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="priceLevel"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price Level
                </label>
                <select
                  id="priceLevel"
                  name="priceLevel"
                  value={localFilters.priceLevel}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Any Price</option>
                  <option value="1">$ (Budget)</option>
                  <option value="2">$$ (Average)</option>
                  <option value="3">$$$ (Premium)</option>
                  <option value="4">$$$$ (Luxury)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Rating
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={localFilters.rating}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
              <Button onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg my-6">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Restaurant Grid */}
        {!loading && !error && (
          <>
            {restaurants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No restaurants found matching your criteria.
                </p>
                {(Object.values(filters).some((value) => value !== null) ||
                  searchTerm) && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => {
                  // Map API response fields to component expected fields
                  const mappedRestaurant = {
                    ...restaurant,
                    cuisine:
                      restaurant.cuisineType || restaurant.cuisine || "Various",
                    rating:
                      restaurant.averageRating || restaurant.rating || 4.5,
                    priceLevel: restaurant.priceLevel || 2,
                  };

                  return (
                    <Link
                      key={restaurant.id}
                      to={`/restaurants/${restaurant.id}`}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 bg-gray-200 relative">
                        {restaurant.imageUrl ? (
                          <img
                            src={restaurant.imageUrl}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-500 text-white">
                            <span className="text-2xl font-semibold">
                              {restaurant.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm py-1 px-3 rounded-full">
                          {mappedRestaurant.rating}{" "}
                          <FiStar className="inline-block ml-1" />
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm mb-4">
                          <span className="mr-2">
                            {mappedRestaurant.cuisine}
                          </span>
                          <span>•</span>
                          <span className="mx-2">
                            {"$".repeat(mappedRestaurant.priceLevel)}
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <FiClock className="mr-1" />
                          <span>{restaurant.deliveryTime || "30-45 min"}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination.total > pagination.limit && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-4 py-2 rounded-md ${
                      pagination.page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Prev
                  </button>

                  {Array.from(
                    { length: Math.ceil(pagination.total / pagination.limit) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md ${
                        pagination.page === page
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={
                      pagination.page ===
                      Math.ceil(pagination.total / pagination.limit)
                    }
                    className={`px-4 py-2 rounded-md ${
                      pagination.page ===
                      Math.ceil(pagination.total / pagination.limit)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;