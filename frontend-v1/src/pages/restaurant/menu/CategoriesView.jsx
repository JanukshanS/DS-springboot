import React from 'react';
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { CategoryManagementView, MobileBackButton } from './UIComponents';

const CategoriesView = ({ categories, menuItems }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <MobileBackButton to="/restaurant-admin/dashboard" />

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

      <CategoryManagementView 
        categories={categories} 
        menuItems={menuItems} 
      />
    </div>
  );
};

export default CategoriesView;
