import React from 'react';
import { FiFilter, FiCheck, FiX } from 'react-icons/fi';

const BulkActions = ({ onMarkAvailable, onMarkUnavailable }) => {
  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        onClick={() => {
          const dropdown = document.getElementById('bulk-actions-dropdown');
          dropdown.classList.toggle('hidden');
        }}
      >
        <FiFilter className="mr-2" />
        Bulk Actions
      </button>
      <div id="bulk-actions-dropdown" className="hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
        <div className="py-1" role="menu" aria-orientation="vertical">
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={onMarkAvailable}
          >
            <FiCheck className="inline mr-2" /> Mark All as Available
          </button>
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={onMarkUnavailable}
          >
            <FiX className="inline mr-2" /> Mark All as Unavailable
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
