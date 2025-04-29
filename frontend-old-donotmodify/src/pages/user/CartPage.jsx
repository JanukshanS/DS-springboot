import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import {
  selectCartItems,
  selectCartTotalAmount,
  selectRestaurant,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  clearCart
} from '../../store/slices/cartSlice';

function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(selectCartItems);
    const restaurant = useSelector(selectRestaurant);
    const cartTotal = useSelector(selectCartTotalAmount);
    
    const handleContinueShopping = () => {
        if (restaurant) {
            navigate(`/restaurants/${restaurant.id}`);
        } else {
            navigate('/restaurants');
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const calculateSubtotal = () => {
        return cartTotal;
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.1; // 10% tax
    };

    const calculateDeliveryFee = () => {
        return restaurant?.deliveryFee || 2.99;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax() + calculateDeliveryFee();
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white bg-opacity-5 rounded-xl p-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-400 mb-8">Looks like you haven't added any items to your cart yet.</p>
                    <button
                        onClick={() => navigate('/restaurants')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg"
                    >
                        Browse Restaurants
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-8">
                <button
                    onClick={handleContinueShopping}
                    className="flex items-center text-indigo-400 hover:text-indigo-300"
                >
                    <FaArrowLeft className="mr-2" />
                    Continue Shopping
                </button>
                <h1 className="text-3xl font-bold ml-auto">Your Cart</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3">
                    <div className="bg-white bg-opacity-5 rounded-xl overflow-hidden shadow-lg border border-gray-800 mb-4">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    {restaurant ? `Order from ${restaurant.name}` : 'Your Order'}
                                </h2>
                                <button
                                    onClick={() => dispatch(clearCart())}
                                    className="text-red-500 hover:text-red-400 flex items-center"
                                >
                                    <FaTrash className="mr-1" />
                                    Clear Cart
                                </button>
                            </div>

                            <div className="divide-y divide-gray-700">
                                {cart.map(item => (
                                    <div key={item.id} className="py-4 flex items-center">
                                        {item.imageUrl && (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-lg mr-4"
                                            />
                                        )}
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-white">{item.name}</h3>
                                            <p className="text-sm text-gray-400">{item.description}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => dispatch(decrementQuantity({ itemId: item.id }))}
                                                className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-full"
                                            >
                                                <FaMinus size={10} />
                                            </button>
                                            <span className="mx-3 text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => dispatch(incrementQuantity({ itemId: item.id }))}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-1 rounded-full"
                                            >
                                                <FaPlus size={10} />
                                            </button>
                                        </div>
                                        <div className="ml-6 text-right">
                                            <div className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                            <div className="text-sm text-gray-400">${item.price.toFixed(2)} each</div>
                                        </div>
                                        <button
                                            onClick={() => dispatch(removeItem({ itemId: item.id }))}
                                            className="ml-4 text-red-500 hover:text-red-400"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white bg-opacity-5 rounded-xl overflow-hidden shadow-lg border border-gray-800 sticky top-4">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white">${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Tax (10%)</span>
                                    <span className="text-white">${calculateTax().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Delivery Fee</span>
                                    <span className="text-white">${calculateDeliveryFee().toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-700 pt-4 flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="text-indigo-400">${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;