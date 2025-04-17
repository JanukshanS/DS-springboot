import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import Button from '../common/Button';

const MenuItem = ({ 
  item, 
  quantity, 
  onQuantityChange, 
  onAddToCart 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-3 hover:bg-orange-50 rounded-lg transition-colors">
      <div className="md:w-1/4">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-32 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      
      <div className="md:w-3/4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{item.name}</h3>
            <span className="font-semibold">${item.price.toFixed(2)}</span>
          </div>
          
          <p className="text-gray-600 text-sm mt-1">
            {item.description || 'No description available.'}
          </p>
          
          {item.dietaryInfo && (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.dietaryInfo.map((info, i) => (
                <span key={i} className="px-2 py-0.5 bg-green-50 text-green-800 text-xs rounded-full">
                  {info}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => onQuantityChange(item.id, -1)}
              disabled={!quantity}
              className={`p-1 rounded-full ${
                quantity
                  ? 'text-orange-500 hover:bg-orange-100'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <FiMinus size={18} />
            </button>
            
            <span className="mx-3 w-6 text-center">
              {quantity || 0}
            </span>
            
            <button
              onClick={() => onQuantityChange(item.id, 1)}
              className="p-1 rounded-full text-orange-500 hover:bg-orange-100"
            >
              <FiPlus size={18} />
            </button>
          </div>
          
          <Button 
            onClick={() => onAddToCart(item)}
            disabled={!quantity}
            size="sm"
            variant={quantity ? "primary" : "outline"}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;