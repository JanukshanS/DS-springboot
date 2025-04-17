import React from 'react';
import MenuItem from './MenuItem';

const MenuSection = ({ 
  category, 
  items, 
  itemQuantities, 
  onQuantityChange, 
  onAddToCart 
}) => {
  return (
    <div id={`category-${category.id}`} className="mb-8">
      <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-100">
        {category.name}
      </h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            quantity={itemQuantities[item.id] || 0}
            onQuantityChange={onQuantityChange}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuSection;