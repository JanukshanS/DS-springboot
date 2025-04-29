import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { logout } from '../../store/slices/authSlice';
import { ShoppingCartIcon, UserIcon, Bars3Icon as MenuIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

/**
 * Header component for the main layout
 * Includes navigation and user-related actions
 */
const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate cart item count
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Navigation links based on authentication status
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Restaurants', href: '/restaurants' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Logo className="h-8" />
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-orange-500"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* User-related actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart icon with item count */}
                <Link
                  to="/user/cart"
                  className="relative p-1 rounded-full text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View cart</span>
                  <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-orange-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="relative ml-3 z-10">
                  <div className="group relative">
                    <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <span className="ml-1 text-sm text-gray-700">{user?.fullName?.split(' ')[0] || 'User'}</span>
                        <svg
                          className="ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </button>
                    <div className="hidden group-hover:block absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {user?.role === 'RESTAURANT_ADMIN' && (
                        <Link
                          to="/restaurant-admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Restaurant Dashboard
                        </Link>
                      )}
                      {user?.role === 'DELIVERY_PERSONNEL' && (
                        <Link
                          to="/delivery/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Delivery Dashboard
                        </Link>
                      )}
                      <Link
                        to="/user/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/user/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-orange-300 hover:text-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        {/* Mobile user actions */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <div className="space-y-1">
              <div className="px-4 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <UserIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.fullName || 'User'}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user?.email || ''}
                  </div>
                </div>
                <Link
                  to="/user/cart"
                  className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 relative"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">View cart</span>
                  <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-orange-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
              
              {user?.role === 'RESTAURANT_ADMIN' && (
                <Link
                  to="/restaurant-admin/dashboard"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-orange-300 hover:text-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Restaurant Dashboard
                </Link>
              )}
              {user?.role === 'DELIVERY_PERSONNEL' && (
                <Link
                  to="/delivery/dashboard"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-orange-300 hover:text-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Delivery Dashboard
                </Link>
              )}
              <Link
                to="/user/profile"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-orange-300 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Your Profile
              </Link>
              <Link
                to="/user/orders"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-orange-300 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Your Orders
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-orange-300 hover:text-gray-800"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-1 px-4 flex flex-col">
              <Link
                to="/login"
                className="block text-center py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="block text-center py-2 px-4 rounded-md text-base font-medium text-white bg-orange-500 hover:bg-orange-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;