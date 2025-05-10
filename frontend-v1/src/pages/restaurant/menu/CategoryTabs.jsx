import React from 'react';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-6 overflow-x-auto px-6 py-3">
        <button
          onClick={() => onCategoryChange("all")}
          className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
            activeCategory === "all"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          All Items
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
              activeCategory === category.id
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {category.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default CategoryTabs;
