import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeItem, updateItemQuantity, clearCart } from '../../store/slices/cartSlice';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { ShoppingBagIcon, TrashIcon } from '@heroicons/react/24/outline';

const CartPage = () => {
  const { items, restaurantId, restaurantName, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle removing item from cart
  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
    toast.success('Item removed from cart');
  };

  // Handle quantity change
  const handleQuantityChange = (itemId, quantity) => {
    dispatch(updateItemQuantity({ itemId, quantity }));
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      toast.success('Cart cleared');
    }
  };

  // Handle proceed to checkout
  const handleCheckout = () => {
    navigate('/user/checkout');
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Your cart is empty
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Looks like you haven't added any items to your cart yet.
          </p>
          <div className="mt-6">
            <Link to="/restaurants">
              <Button>Browse Restaurants</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Restaurant info */}
        <div className="bg-gray-50 px-4 py-4 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Order from: {restaurantName}
          </h2>
        </div>

        {/* Cart items */}
        <ul role="list" className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="px-4 py-6 sm:px-6 flex flex-col sm:flex-row sm:items-center">
              {/* Item image (if available) */}
              {item.image && (
                <div className="flex-shrink-0 mr-6 mb-4 sm:mb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                </div>
              )}

              {/* Item details */}
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                <p className="mt-1 text-sm text-gray-700">
                  ${parseFloat(item.price).toFixed(2)} each
                </p>
              </div>

              {/* Quantity controls */}
              <div className="mt-4 sm:mt-0 flex items-center">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-900"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <span className="sr-only">Decrease</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-2 py-1 text-center w-10">{item.quantity}</span>
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-900"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <span className="sr-only">Increase</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Item subtotal */}
                <div className="ml-4 sm:ml-6 text-sm sm:text-base font-medium text-gray-900 min-w-[80px] text-right">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  className="ml-4 text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <span className="sr-only">Remove</span>
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Order summary */}
        <div className="px-4 py-6 sm:px-6 border-t border-gray-200">
          <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
            <p>Subtotal</p>
            <p>${total.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
            <p>Delivery Fee</p>
            <p>$2.99</p>
          </div>
          <div className="flex justify-between text-base font-medium text-gray-900 mb-6">
            <p>Total</p>
            <p>${(total + 2.99).toFixed(2)}</p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="sm:flex-1"
            >
              Clear Cart
            </Button>
            <Button
              onClick={handleCheckout}
              className="sm:flex-1"
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/restaurants"
          className="text-sm font-medium text-orange-500 hover:text-orange-600"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartPage;