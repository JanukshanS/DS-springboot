import React from 'react';
import { FiPlusCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../../../components/common/Button";

// Loading spinner component
export const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

// No items found component
export const NoItemsFound = ({ activeCategory, onAddClick }) => (
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

// Error message component
export const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg my-6">
    <h3 className="text-lg font-semibold mb-2">Error</h3>
    <p>{message}</p>
  </div>
);

// Back button for mobile view
export const MobileBackButton = ({ to, text = "Back to Dashboard" }) => (
  <div className="md:hidden mb-4">
    <Link
      to={to}
      className="inline-flex items-center text-gray-500 hover:text-gray-700"
    >
      <FiArrowLeft className="mr-1" />
      {text}
    </Link>
  </div>
);

// Category management view
export const CategoryManagementView = ({ categories, menuItems }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-medium text-gray-900">Categories</h2>
      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700">
        <FiPlusCircle className="mr-2" />
        Add Category
      </button>
    </div>

    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {categories.map((category) => (
          <li key={category.id}>
            <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">
                  {category.name}
                </span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {menuItems.filter((item) => item.category === category.id).length} items
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// New item form container
export const NewItemFormContainer = ({ formError, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-medium text-gray-900">Add New Menu Item</h2>
    </div>

    {formError && <ErrorMessage message={formError} />}
    
    <div className="mt-4">
      {children}
    </div>
  </div>
);
