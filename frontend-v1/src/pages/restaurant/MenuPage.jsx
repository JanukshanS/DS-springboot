import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiEdit2, FiTrash2, FiPlusCircle, FiImage, FiDollarSign, FiAlertCircle } from 'react-icons/fi';

const MenuPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Form state for adding/editing menu items
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
    isAvailable: true,
    preparationTime: 15
  });

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would call your API
        // const menuResponse = await restaurantService.getMenuItems();
        // const categoriesResponse = await restaurantService.getCategories();
        
        // Mock data for development
        const mockCategories = [
          { id: 'appetizers', name: 'Appetizers' },
          { id: 'main_courses', name: 'Main Courses' },
          { id: 'pizzas', name: 'Pizzas' },
          { id: 'pasta', name: 'Pasta' },
          { id: 'sides', name: 'Side Dishes' },
          { id: 'desserts', name: 'Desserts' },
          { id: 'beverages', name: 'Beverages' }
        ];
        
        const mockMenuItems = [
          {
            id: '1',
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 12.99,
            category: 'pizzas',
            imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
            isAvailable: true,
            preparationTime: 15
          },
          {
            id: '2',
            name: 'Pepperoni Pizza',
            description: 'Pizza with tomato sauce, mozzarella, and pepperoni',
            price: 14.99,
            category: 'pizzas',
            imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
            isAvailable: true,
            preparationTime: 15
          },
          {
            id: '3',
            name: 'Garlic Bread',
            description: 'Freshly baked bread with garlic butter and herbs',
            price: 5.99,
            category: 'appetizers',
            imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
            isAvailable: true,
            preparationTime: 10
          },
          {
            id: '4',
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
            price: 8.99,
            category: 'appetizers',
            imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
            isAvailable: true,
            preparationTime: 5
          },
          {
            id: '5',
            name: 'Spaghetti Carbonara',
            description: 'Spaghetti with creamy sauce, bacon, and parmesan',
            price: 13.99,
            category: 'pasta',
            imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
            isAvailable: true,
            preparationTime: 20
          },
          {
            id: '6',
            name: 'Tiramisu',
            description: 'Classic Italian dessert with coffee, mascarpone, and cocoa',
            price: 7.99,
            category: 'desserts',
            imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea2fa33?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
            isAvailable: true,
            preparationTime: 0
          },
          {
            id: '7',
            name: 'Soft Drink',
            description: 'Choice of Coca-Cola, Sprite, or Fanta',
            price: 2.99,
            category: 'beverages',
            imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
            isAvailable: true,
            preparationTime: 0
          }
        ];
        
        setCategories(mockCategories);
        setMenuItems(mockMenuItems);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'price' || name === 'preparationTime') {
      // Only allow numbers for price and preparation time
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (value === '' || regex.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddItem = () => {
    setCurrentItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: activeCategory !== 'all' ? activeCategory : '',
      image: null,
      isAvailable: true,
      preparationTime: 15
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      image: null,
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime.toString()
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        // In a real app, you would call your API
        // await restaurantService.deleteMenuItem(itemId);
        
        // For development, just update the state
        setMenuItems(menuItems.filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // In a real app, you would call your API
      // const formDataToSend = new FormData();
      // Object.entries(formData).forEach(([key, value]) => {
      //   formDataToSend.append(key, value);
      // });
      
      // let response;
      // if (currentItem) {
      //   response = await restaurantService.updateMenuItem(currentItem.id, formDataToSend);
      // } else {
      //   response = await restaurantService.createMenuItem(formDataToSend);
      // }
      
      // For development, just update the state
      if (currentItem) {
        setMenuItems(menuItems.map(item => 
          item.id === currentItem.id 
            ? { 
                ...item, 
                name: formData.name, 
                description: formData.description, 
                price: parseFloat(formData.price), 
                category: formData.category,
                isAvailable: formData.isAvailable,
                preparationTime: parseInt(formData.preparationTime)
              } 
            : item
        ));
      } else {
        const newItem = {
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          imageUrl: 'https://via.placeholder.com/150',
          isAvailable: formData.isAvailable,
          preparationTime: parseInt(formData.preparationTime)
        };
        setMenuItems([...menuItems, newItem]);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const filteredMenuItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant's menu items</p>
        </div>
        <button
          onClick={handleAddItem}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPlusCircle className="mr-2" />
          Add New Item
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <span className="text-orange-600 font-semibold">{formatCurrency(item.price)}</span>
                </div>
                
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{categories.find(c => c.id === item.category)?.name}</span>
                  {item.preparationTime > 0 && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{item.preparationTime} min prep</span>
                    </>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md flex items-center"
                  >
                    <FiEdit2 className="mr-1" size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="bg-gray-100 hover:bg-gray-200 text-red-600 px-3 py-1 rounded-md flex items-center"
                  >
                    <FiTrash2 className="mr-1" size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {currentItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        {/* Name */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                              formErrors.name ? 'border-red-300' : ''
                            }`}
                            placeholder="Dish name"
                          />
                          {formErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                          )}
                        </div>
                        
                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            name="description"
                            id="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            placeholder="Brief description of the dish"
                          ></textarea>
                        </div>
                        
                        {/* Price & Preparation Time */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiDollarSign className="text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="price"
                                id="price"
                                value={formData.price}
                                onChange={handleFormChange}
                                className={`block w-full pl-8 pr-12 border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                                  formErrors.price ? 'border-red-300' : ''
                                }`}
                                placeholder="0.00"
                              />
                            </div>
                            {formErrors.price && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="preparationTime" className="block text-sm font-medium text-gray-700">Prep Time (min)</label>
                            <input
                              type="text"
                              name="preparationTime"
                              id="preparationTime"
                              value={formData.preparationTime}
                              onChange={handleFormChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                              placeholder="15"
                            />
                          </div>
                        </div>
                        
                        {/* Category */}
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                          <select
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleFormChange}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                              formErrors.category ? 'border-red-300' : ''
                            }`}
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                          </select>
                          {formErrors.category && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                          )}
                        </div>
                        
                        {/* Image Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Image</label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                                  <span>Upload a file</span>
                                  <input id="image" name="image" type="file" className="sr-only" onChange={handleFormChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Availability Toggle */}
                        <div className="flex items-center">
                          <input
                            id="isAvailable"
                            name="isAvailable"
                            type="checkbox"
                            checked={formData.isAvailable}
                            onChange={handleFormChange}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                            Item is available
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {currentItem ? 'Update Item' : 'Add Item'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;