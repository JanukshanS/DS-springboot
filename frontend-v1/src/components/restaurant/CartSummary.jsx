import React from 'react';

const CartSummary = ({ itemCount, totalAmount, onViewCart }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-30">
      <div className="container mx-auto">
        <button
          onClick={onViewCart}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center"
        >
          <span className="mr-2">View Cart</span>
          <span className="bg-white text-orange-500 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
            {itemCount}
          </span>
          <span className="ml-auto">${totalAmount.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};

export default CartSummary;