import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantService } from '../../services/api';
import { FaStar, FaSearch, FaFilter } from 'react-icons/fa';

function RestaurantList() {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [cuisineFilter, setCuisineFilter] = useState('All');
    const [cuisines, setCuisines] = useState(['All']);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);
                const response = await restaurantService.getAllRestaurants();
                setRestaurants(response.data);
                setFilteredRestaurants(response.data);

                // Extract unique cuisines for filtering
                const uniqueCuisines = ['All', ...new Set(response.data.map(restaurant => restaurant.cuisine))];
                setCuisines(uniqueCuisines);
            } catch (err) {
                console.error('Error fetching restaurants:', err);
                setError('Failed to load restaurants. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    useEffect(() => {
        // Filter restaurants based on search term and cuisine
        let results = restaurants;

        if (searchTerm) {
            results = results.filter(restaurant =>
                restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (cuisineFilter !== 'All') {
            results = results.filter(restaurant =>
                restaurant.cuisine === cuisineFilter
            );
        }

        setFilteredRestaurants(results);
    }, [searchTerm, cuisineFilter, restaurants]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCuisineChange = (cuisine) => {
        setCuisineFilter(cuisine);
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Explore Restaurants</h1>

            <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search restaurants or cuisines..."
                            className="pl-10 pr-4 py-2 w-full rounded-lg bg-white bg-opacity-10 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="relative">
                        <div className="flex items-center">
                            <FaFilter className="text-gray-400 mr-2" />
                            <span className="text-gray-300 mr-2">Filter by cuisine:</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {cuisines.map(cuisine => (
                        <button
                            key={cuisine}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                                cuisineFilter === cuisine
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            }`}
                            onClick={() => handleCuisineChange(cuisine)}
                        >
                            {cuisine}
                        </button>
                    ))}
                </div>
            </div>

            {filteredRestaurants.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-lg">No restaurants found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRestaurants.map(restaurant => (
                        <Link
                            key={restaurant.id}
                            to={`/restaurants/${restaurant.id}`}
                            className="bg-white bg-opacity-5 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-gray-800"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={restaurant.imageUrl || 'https://via.placeholder.com/400x200?text=Restaurant'}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-bold text-white">{restaurant.name}</h2>
                                    <div className="flex items-center bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-sm font-medium">
                                        <FaStar className="mr-1" />
                                        {restaurant.rating.toFixed(1)}
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">{restaurant.cuisine}</p>
                                <p className="text-gray-300 mb-4 line-clamp-2">{restaurant.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-400">
                                    <span>{restaurant.deliveryTime || '30-45 min'}</span>
                                    <span>{restaurant.deliveryFee ? `$${restaurant.deliveryFee.toFixed(2)} delivery` : 'Free delivery'}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RestaurantList;