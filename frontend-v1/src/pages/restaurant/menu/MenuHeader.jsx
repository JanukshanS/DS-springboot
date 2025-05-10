import React from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import Button from '../../../components/common/Button';
import BulkActions from './BulkActions';

const MenuHeader = ({ onAddItem, onMarkAvailable, onMarkUnavailable }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add, edit, and manage your restaurant's menu items
        </p>
      </div>
      <div className="mt-4 md:mt-0 flex space-x-2">
        <Button
          onClick={onAddItem}
          variant="primary"
          className="inline-flex items-center"
        >
          <FiPlusCircle className="mr-2" />
          Add Menu Item
        </Button>
        <BulkActions 
          onMarkAvailable={onMarkAvailable}
          onMarkUnavailable={onMarkUnavailable}
        />
      </div>
    </div>
  );
};

export default MenuHeader;
