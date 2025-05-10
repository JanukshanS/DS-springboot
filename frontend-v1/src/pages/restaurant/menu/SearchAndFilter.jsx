import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchAndFilter = ({ searchTerm, onSearchChange, hasFilters, onClearFilters }) => {
  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
