import React from 'react';
import { FiEdit2, FiTrash2, FiClock, FiImage } from 'react-icons/fi';

const MenuItemsList = ({ items, categories, onEdit, onDelete }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Items Found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No menu items match your current filters.
        </p>
      </div>
    );
  }

  // Create a unique key for each item by combining id with other properties if needed
  const getUniqueKey = (item, index) => {
    return item.id ? `${item.id}-${index}` : `item-${index}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {items.map((item, index) => (
        <div
          key={getUniqueKey(item, index)}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="relative h-48 bg-gray-200">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <FiImage className="h-12 w-12 text-gray-400" />
              </div>
            )}
            {!item.isAvailable && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1">
                Unavailable
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {item.description || "No description available"}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-orange-600">
                ${parseFloat(item.price).toFixed(2)}
              </span>
              <div className="flex items-center text-xs text-gray-500">
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
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
            <button
              onClick={() => onEdit(item)}
              className="text-blue-600 hover:text-blue-800 p-2"
              aria-label={`Edit ${item.name}`}
            >
              <FiEdit2 />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-600 hover:text-red-800 p-2"
              aria-label={`Delete ${item.name}`}
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemsList;
