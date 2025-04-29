import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { removeItem, updateItemQuantity, clearCart } from '../store/slices/cartSlice';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurantId, restaurantName, total } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };
  
  const handleUpdateQuantity = (itemId, quantity) => {
    dispatch(updateItemQuantity({ itemId, quantity }));
  };
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };
  
  // Calculate delivery fee and taxes
  const subtotal = total;
  const deliveryFee = 3.99;
  const tax = subtotal * 0.08; // Assuming 8% tax rate
  const orderTotal = subtotal + deliveryFee + tax;
  
  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center">
                  <FiShoppingBag className="text-orange-500" size={36} />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link to="/restaurants">
                <Button>Browse Restaurants</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <button onClick={() => navigate(-1)} className="mr-4 text-gray-600 hover:text-gray-900">
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-rowdies font-bold">Your Cart</h1>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Items from {restaurantName}</h2>
                  <button 
                    onClick={handleClearCart}
                    className="text-gray-500 hover:text-red-500 flex items-center"
                  >
                    <FiTrash2 className="mr-1" />
                    <span>Clear Cart</span>
                  </button>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-4">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-orange-600">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              handleUpdateQuantity(item.id, item.quantity - 1);
                            } else {
                              handleRemoveItem(item.id);
                            }
                          }}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="mx-3 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>
                      
                      <div className="ml-6 w-20 text-right">
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-4 text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Instructions</h2>
                <textarea
                  placeholder="Add delivery instructions (optional)"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                ></textarea>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-orange-600">${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button onClick={handleCheckout} fullWidth>
                  {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                </Button>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link to={`/restaurants/${restaurantId}`} className="text-orange-600 hover:text-orange-700 flex items-center">
                    <FiPlus className="mr-2" />
                    <span>Add More Items</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;