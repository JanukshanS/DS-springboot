import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiStar, FiDollarSign, FiClock } from 'react-icons/fi';
import { restaurant as restaurantService } from '../services/api';
import Button from '../components/common/Button';
import MenuItemDTO from '../models/MenuItemDTO';

const MenuItemsPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false
    }
  });

  // Categories for filtering
  const categories = [
    'Appetizers',
    'Main Course',
    'Desserts',
    'Beverages',
    'Sides',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Specials'
  ];

  // Price ranges for filtering
  const priceRanges = [
    { label: 'Under $5', min: 0, max: 5 },
    { label: '$5 - $10', min: 5, max: 10 },
    { label: '$10 - $15', min: 10, max: 15 },
    { label: '$15 - $20', min: 15, max: 20 },
    { label: 'Over $20', min: 20, max: Infinity }
  ];

  // Fetch all menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await restaurantService.getAllMenuItems();
        
        // Map response data to MenuItemDTO objects
        const items = response.data.map(item => MenuItemDTO.fromResponse(item));
        setMenuItems(items);
        setFilteredItems(items);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Filter menu items when search term or filters change
  useEffect(() => {
    if (!menuItems.length) return;

    let filtered = [...menuItems];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) || 
        (item.description && item.description.toLowerCase().includes(term))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Apply price range filter
    if (filters.priceRange) {
      const range = priceRanges.find(range => range.label === filters.priceRange);
      if (range) {
        filtered = filtered.filter(item => 
          item.price >= range.min && item.price <= range.max
        );
      }
    }

    // Apply dietary filters
    if (filters.dietary.vegetarian) {
      filtered = filtered.filter(item => item.isVegetarian);
    }
    if (filters.dietary.vegan) {
      filtered = filtered.filter(item => item.isVegan);
    }
    if (filters.dietary.glutenFree) {
      filtered = filtered.filter(item => item.isGlutenFree);
    }

    setFilteredItems(filtered);
  }, [searchTerm, filters, menuItems]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFilters(prev => ({
        ...prev,
        dietary: {
          ...prev.dietary,
          [name]: checked
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      dietary: {
        vegetarian: false,
        vegan: false,
        glutenFree: false
      }
    });
    setSearchTerm('');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Group menu items by restaurant
  const groupedByRestaurant = filteredItems.reduce((acc, item) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = [];
    }
    acc[item.restaurantId].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-rowdies font-bold text-gray-800 mb-4 md:mb-0">
            All Menu Items
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search menu items..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  id="priceRange"
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Any Price</option>
                  {priceRanges.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Preferences
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="vegetarian"
                      name="vegetarian"
                      type="checkbox"
                      checked={filters.dietary.vegetarian}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="vegetarian" className="ml-2 text-sm text-gray-700">
                      Vegetarian
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="vegan"
                      name="vegan"
                      type="checkbox"
                      checked={filters.dietary.vegan}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="vegan" className="ml-2 text-sm text-gray-700">
                      Vegan
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="glutenFree"
                      name="glutenFree"
                      type="checkbox"
                      checked={filters.dietary.glutenFree}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="glutenFree" className="ml-2 text-sm text-gray-700">
                      Gluten Free
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
              <Button onClick={toggleFilters}>
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

        {/* Menu Items Display */}
        {!loading && !error && (
          <>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No menu items found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={resetFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(groupedByRestaurant).map(([restaurantId, items]) => (
                  <div key={restaurantId} className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                    <h2 className="text-2xl font-rowdies font-bold text-gray-800 mb-4">
                      Restaurant ID: {restaurantId}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="h-40 bg-gray-200 relative">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-500 text-white">
                                <span className="text-2xl font-semibold">{item.name.charAt(0)}</span>
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex space-x-1">
                              {item.isVegetarian && (
                                <span className="bg-green-500 text-white text-xs py-1 px-2 rounded-full">Veg</span>
                              )}
                              {item.isVegan && (
                                <span className="bg-green-600 text-white text-xs py-1 px-2 rounded-full">Vegan</span>
                              )}
                              {item.isGlutenFree && (
                                <span className="bg-blue-500 text-white text-xs py-1 px-2 rounded-full">GF</span>
                              )}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                              <span className="text-orange-500 font-semibold">${item.price.toFixed(2)}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {item.category || 'Uncategorized'}
                            </p>
                            {item.description && (
                              <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            <Link to={`/restaurants/${item.restaurantId}`}>
                              <Button variant="outline" size="sm" fullWidth>
                                View Restaurant
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MenuItemsPage;
