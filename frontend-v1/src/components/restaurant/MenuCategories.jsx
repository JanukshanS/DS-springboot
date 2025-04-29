import React from 'react';

const MenuCategories = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
      <h3 className="font-semibold text-lg mb-4">Menu</h3>
      <nav className="space-y-2">
        {categories && categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`block w-full text-left px-4 py-2 rounded-md hover:bg-orange-50 ${
              selectedCategory === category.id
                ? 'bg-orange-100 text-orange-800 font-medium'
                : 'text-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MenuCategories;