import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  FiEdit2,
  FiTrash2,
  FiPlusCircle,
  FiImage,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import MenuForm from "./menu/MenuForm";
import MenuUpdateForm from "./menu/MenuUpdateForm";
import Button from "../../components/common/Button";
// import { uploadImage } from "../../services/ImageService";
// import { restaurant as restaurantService } from "../../../services/api";
//slice
import { useDispatch } from "react-redux";
import { createMenuItem as restaurantSlice } from "../../store/slices/restaurantSlice";




// Helper Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

const NoItemsFound = ({ activeCategory, onAddClick }) => (
  <div className="text-center py-12">
    <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-lg font-medium text-gray-900">No Menu Items</h3>
    <p className="mt-1 text-sm text-gray-500">
      {activeCategory === "all"
        ? "You haven't added any menu items yet."
        : "No items in this category."}
    </p>
    <div className="mt-6">
      <Button
        onClick={onAddClick}
        variant="primary"
        className="inline-flex items-center"
      >
        <FiPlusCircle className="mr-2" />
        Add Menu Item
      </Button>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg my-6">
    <h3 className="text-lg font-semibold mb-2">Error</h3>
    <p>{message}</p>
  </div>
);

const MenuPage = ({ categoriesView = false, newItem = false }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
const dispatch = useDispatch();
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);

        // In a real app, you would call your API
        // const menuResponse = await restaurantService.getMenuItems();
        // const categoriesResponse = await restaurantService.getCategories();

        // Mock data for development
        const mockCategories = [
          { id: "appetizers", name: "Appetizers" },
          { id: "main_courses", name: "Main Courses" },
          { id: "pizzas", name: "Pizzas" },
          { id: "pasta", name: "Pasta" },
          { id: "sides", name: "Side Dishes" },
          { id: "desserts", name: "Desserts" },
          { id: "beverages", name: "Beverages" },
        ];

        const mockMenuItems = [
          {
            id: "1",
            name: "Margherita Pizza",
            description:
              "Classic pizza with tomato sauce, mozzarella, and basil",
            price: 12.99,
            category: "pizzas",
            imageUrl:
              "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
            isAvailable: true,
            preparationTime: 15,
          },
          {
            id: "2",
            name: "Pepperoni Pizza",
            description: "Pizza with tomato sauce, mozzarella, and pepperoni",
            price: 14.99,
            category: "pizzas",
            imageUrl:
              "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
            isAvailable: true,
            preparationTime: 15,
          },
          {
            id: "3",
            name: "Garlic Bread",
            description: "Freshly baked bread with garlic butter and herbs",
            price: 5.99,
            category: "appetizers",
            imageUrl:
              "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
            isAvailable: true,
            preparationTime: 10,
          },
          {
            id: "4",
            name: "Caesar Salad",
            description:
              "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
            price: 8.99,
            category: "appetizers",
            imageUrl:
              "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
            isAvailable: true,
            preparationTime: 5,
          },
          {
            id: "5",
            name: "Spaghetti Carbonara",
            description: "Spaghetti with creamy sauce, bacon, and parmesan",
            price: 13.99,
            category: "pasta",
            imageUrl:
              "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
            isAvailable: true,
            preparationTime: 20,
          },
          {
            id: "6",
            name: "Tiramisu",
            description:
              "Classic Italian dessert with coffee, mascarpone, and cocoa",
            price: 7.99,
            category: "desserts",
            imageUrl:
              "https://images.unsplash.com/photo-1571877227200-a0d98ea2fa33?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
            isAvailable: true,
            preparationTime: 0,
          },
          {
            id: "7",
            name: "Soft Drink",
            description: "Choice of Coca-Cola, Sprite, or Fanta",
            price: 2.99,
            category: "beverages",
            imageUrl:
              "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
            isAvailable: true,
            preparationTime: 0,
          },
        ];

        setCategories(mockCategories);
        setMenuItems(mockMenuItems);
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setFormError("Failed to load menu data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Filtered menu items based on active category
  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

      const handleAddMenuItem = async (newItem) => {
        try {
          await dispatch(restaurantSlice(newItem));
        } catch (error) {
          console.error("Failed to add menu item:", error);
        }
      };

  const handleAddItem = () => {
    setCurrentItem(null);
    setFormError(null);
    // In standalone form page case, navigate to the form
    if (!newItem) {
      setIsModalOpen(true);
    }
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        // In a real app, you would call your API
        // await restaurantService.deleteMenuItem(itemId);

        // For development, just update the state
        setMenuItems(menuItems.filter((item) => item.id !== itemId));
      } catch (error) {
        console.error("Error deleting menu item:", error);
        setFormError("Failed to delete item. Please try again.");
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setFormError(null);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // In a real app, you would call your API
      // let response;
      // if (currentItem) {
      //   response = await restaurantService.updateMenuItem(currentItem.id, formData);
      // } else {
      //   response = await restaurantService.createMenuItem(formData);
      // }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For development, just update the state
      if (currentItem) {
        setMenuItems(
          menuItems.map((item) =>
            item.id === currentItem.id
              ? {
                  ...item,
                  name: formData.name,
                  description: formData.description,
                  price: formData.price,
                  category: formData.category,
                  isAvailable: formData.isAvailable,
                  preparationTime: formData.preparationTime,
                  // Preserve existing image URL if no new image
                  imageUrl: formData.image
                    ? URL.createObjectURL(formData.image)
                    : item.imageUrl,
                }
              : item
          )
        );
      } else {
        // Create a new item with a mock ID
        const newItem = {
          id: `item-${Date.now()}`,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          imageUrl: formData.image
            ? URL.createObjectURL(formData.image)
            : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80",
          isAvailable: formData.isAvailable,
          preparationTime: formData.preparationTime,
        };

        setMenuItems([...menuItems, newItem]);
      }

      // Close modal after successful submit
      setIsModalOpen(false);
      setCurrentItem(null);

      // If we're on the dedicated new item page, navigate back to menu
      if (newItem) {
        navigate("/restaurant-admin/menu");
      }
    } catch (error) {
      console.error("Error saving menu item:", error);
      setFormError("Failed to save menu item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state
  if (loading && !newItem && !categoriesView) {
    return <LoadingSpinner />;
  }

  // Render category management view
  if (categoriesView) {
    return (
      <div className="p-4">
        <div className="mb-6">
          <Link
            to="/restaurant-admin/menu"
            className="flex items-center text-orange-600 hover:text-orange-700"
          >
            <FiArrowLeft className="mr-2" />
            Back to Menu
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            Manage Menu Categories
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Categories</h2>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700">
              <FiPlusCircle className="mr-2" />
              Add Category
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Items Count
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {
                        menuItems.filter(
                          (item) => item.category === category.id
                        ).length
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <FiEdit2 />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Render new item form
  if (newItem) {
    return (
      <div className="p-4">
        <div className="mb-6">
          <Link
            to="/restaurant-admin/menu"
            className="flex items-center text-orange-600 hover:text-orange-700"
          >
            <FiArrowLeft className="mr-2" />
            Back to Menu
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            Add New Menu Item
          </h1>
        </div>

        {formError && <ErrorMessage message={formError} />}

        <MenuForm
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={() => navigate("/restaurant-admin/menu")}
          isLoading={isSubmitting}
          formError={formError}
        />
      </div>
    );
  }

  // Default menu items view
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant's menu items</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link
            to="/restaurant-admin/menu/categories"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Manage Categories
          </Link>
          <Link
            to="/restaurant-admin/menu/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
          >
            <FiPlusCircle className="mr-2" />
            Add Menu Item
          </Link>
        </div>
      </div>

      {formError && <ErrorMessage message={formError} />}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeCategory === "all"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
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
                    ? "bg-orange-100 text-orange-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-4">
          {filteredItems.length === 0 ? (
            <NoItemsFound
              activeCategory={activeCategory}
              onAddClick={() => navigate("/restaurant-admin/menu/new")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col"
                >
                  <div className="h-48 bg-gray-200 relative">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                        <FiImage className="w-12 h-12" />
                      </div>
                    )}
                    {!item.isAvailable && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1">
                        Unavailable
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-gray-500">
                      <span className="bg-gray-100 rounded-full px-2 py-1">
                        {categories.find((c) => c.id === item.category)?.name ||
                          item.category}
                      </span>
                      {item.preparationTime > 0 && (
                        <span className="ml-2 flex items-center">
                          <FiClock className="mr-1" />
                          {item.preparationTime} min
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      aria-label={`Edit ${item.name}`}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      aria-label={`Delete ${item.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Menu Item Modal */}
      {isModalOpen && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-modal="true"
          role="dialog"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={handleModalClose}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {currentItem
                      ? `Edit ${currentItem.name}`
                      : "Edit Menu Item"}
                  </h3>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={handleModalClose}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <MenuUpdateForm
                  initialData={currentItem}
                  categories={categories}
                  onSubmit={handleFormSubmit}
                  onCancel={handleModalClose}
                  isLoading={isSubmitting}
                  formError={formError}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;