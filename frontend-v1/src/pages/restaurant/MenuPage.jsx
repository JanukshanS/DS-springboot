import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
// Import API services
import { restaurant as restaurantAPI } from "../../services/api";
// Import Redux actions
import { 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  fetchRestaurantDetails,
  clearError 
} from "../../store/slices/restaurantSlice";

// Import modular components
import MainMenuView from './menu/MainMenuView';
import CategoriesView from './menu/CategoriesView';
import NewItemView from './menu/NewItemView';
import { LoadingSpinner } from './menu/UIComponents';

// Helper components moved to UIComponents.jsx

const MenuPage = ({ categoriesView = false, newItem = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { restaurantId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { currentRestaurant, loading, error } = useSelector((state) => state.restaurants);
  
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    // If we're in new item view, open the form
    if (newItem) {
      handleAddItem();
    }
    
    // Fetch restaurant details including menu items
    if (restaurantId) {
      // Use isDashboard=true for the restaurant dashboard to show all menu items
      // This will fetch all menu items including unavailable ones
      const isDashboard = true; // We're in the restaurant management dashboard
      dispatch(fetchRestaurantDetails({ id: restaurantId, isDashboard }));
    }
    
    // Cleanup function
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, restaurantId, newItem]);

  // Process data when restaurant details are loaded
  useEffect(() => {
    if (currentRestaurant) {
      // Extract menu items from restaurant data
      if (currentRestaurant.menuItems) {
        setMenuItems(currentRestaurant.menuItems);
        setFilteredItems(currentRestaurant.menuItems);
      }
      
      // Fetch categories from the API
      const fetchCategories = async () => {
        try {
          const response = await restaurantAPI.getCuisines();
          // Transform categories to the format expected by the component
          const formattedCategories = response.data.map(cuisine => ({
            id: cuisine.toLowerCase().replace(/\s+/g, '_'),
            name: cuisine
          }));
          setCategories(formattedCategories);
        } catch (error) {
          console.error('Error fetching categories:', error);
          toast.error('Failed to load menu categories');
        }
      };
      
      fetchCategories();
      
      // If we're in categories view, set the initial category
      if (categoriesView) {
        setActiveCategory("categories");
      }
    }
  }, [currentRestaurant, categoriesView]);
  
  // Filter menu items based on search term and active category
  useEffect(() => {
    if (!menuItems.length) return;
    
    let filtered = [...menuItems];
    
    // Apply category filter if not showing all
    if (activeCategory !== "all" && activeCategory !== "categories") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) || 
        (item.description && item.description.toLowerCase().includes(term))
      );
    }
    
    setFilteredItems(filtered);
  }, [menuItems, activeCategory, searchTerm]);

  // Show error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);
  
  const handleAddItem = () => {
    // Reset current item and open modal
    setCurrentItem(null);
    setIsModalOpen(true);
    setFormError(null);
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
    setFormError(null);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      dispatch(deleteMenuItem(itemId))
        .unwrap()
        .then(() => {
          toast.success('Menu item deleted successfully');
          // Update local state to remove the deleted item
          setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
        })
        .catch(error => {
          toast.error(`Failed to delete menu item: ${error}`);
        });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setFormError(null);
  };

  const handleFormSubmit = (formData) => {
    setIsSubmitting(true);
    setFormError(null);
    
    console.log('Form data received from MenuForm:', formData);
    
    if (!formData.name) {
        setFormError('Item name is required');
        setIsSubmitting(false);
        return;
    }
    
    if (!formData.category) {
        setFormError('Category is required');
        setIsSubmitting(false);
        return;
    }
    
    if (!formData.price || isNaN(formData.price)) {
        setFormError('Valid price is required');
        setIsSubmitting(false);
        return;
    }
    
    // If editing, include the item ID
    if (currentItem) {
        // Create the data object with all necessary fields
        const menuItemData = {
            ...formData,
            restaurantId: restaurantId
        };
        
        console.log('Updating menu item with data:', menuItemData);
        
        // Update existing item - pass both id and menuItemData
        dispatch(updateMenuItem({ 
            id: currentItem.id, 
            menuItemData: menuItemData 
        }))
            .unwrap()
            .then(updatedItem => {
                toast.success('Menu item updated successfully');
                // Update the item in the local state
                setMenuItems(prevItems => 
                    prevItems.map(item => 
                        item.id === updatedItem.id ? updatedItem : item
                    )
                );
                handleModalClose();
            })
            .catch(error => {
                console.error('Error updating menu item:', error);
                setFormError(error?.message || 'Failed to update menu item. Please try again.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    } else {
        // Create new item
        const menuItemData = {
            ...formData,
            restaurantId: restaurantId
        };
        
        console.log('Creating new menu item with data:', menuItemData);
        
        dispatch(createMenuItem({ restaurantId, menuItemData }))
            .unwrap()
            .then(newItem => {
                toast.success('Menu item added successfully');
                dispatch(fetchRestaurantDetails({ id: restaurantId, isDashboard: true }));
                handleModalClose();
            })
            .catch(error => {
                console.error('Error creating menu item:', error);
                setFormError(error?.message || 'Failed to create menu item. Please try again.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }
};
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('all');
  };
  
  // Handle bulk operations
  const handleBulkAvailabilityUpdate = (available) => {
    if (!filteredItems.length) return;
    
    const itemIds = filteredItems.map(item => item.id);
    const confirmMessage = available ? 
      `Make ${itemIds.length} items available?` : 
      `Make ${itemIds.length} items unavailable?`;
      
    if (window.confirm(confirmMessage)) {
      // Create an array of promises for each update
      const updatePromises = itemIds.map(id => 
        restaurantAPI.updateMenuItemAvailability(id, available)
      );
      
      Promise.all(updatePromises)
        .then(() => {
          toast.success(`Successfully updated ${itemIds.length} items`);
          // Refresh the restaurant details to get updated items
          dispatch(fetchRestaurantDetails({ id: restaurantId, isDashboard: true }));
        })
        .catch(error => {
          console.error('Error updating items:', error);
          toast.error('Failed to update some items');
        });
    }
  };

  // Render loading state
  if (loading && !newItem && !categoriesView) {
    return <LoadingSpinner />;
  }

  // Render category management view
  if (categoriesView) {
    return <CategoriesView categories={categories} menuItems={menuItems} />;
  }

  // Render new item form
  if (newItem) {
    return (
      <NewItemView
        categories={categories}
        handleFormSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        formError={formError}
      />
    );
  }

  // This section is now handled by the CategoriesView component
  
  // Default menu items view
  return (
    <MainMenuView
      loading={loading}
      error={error}
      menuItems={menuItems}
      filteredItems={filteredItems}
      categories={categories}
      activeCategory={activeCategory}
      searchTerm={searchTerm}
      isModalOpen={isModalOpen}
      currentItem={currentItem}
      isSubmitting={isSubmitting}
      formError={formError}
      handleAddItem={handleAddItem}
      handleEditItem={handleEditItem}
      handleDeleteItem={handleDeleteItem}
      handleModalClose={handleModalClose}
      handleFormSubmit={handleFormSubmit}
      handleSearchChange={handleSearchChange}
      clearFilters={clearFilters}
      setActiveCategory={setActiveCategory}
      handleBulkAvailabilityUpdate={handleBulkAvailabilityUpdate}
    />
  );
};

export default MenuPage;