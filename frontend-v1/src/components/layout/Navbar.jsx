import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { logout, fetchUserProfile } from '../../store/slices/authSlice';
import Button from '../common/Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If authenticated but no user data, fetch it
  useEffect(() => {
    if (isAuthenticated && !user && !loading) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, user, loading, dispatch]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Food Delivery" className="h-10 w-auto" />
          <span className="ml-2 text-xl font-rowdies font-bold text-orange-500">
            FoodDash
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-orange-500 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/restaurants"
            className="text-gray-700 hover:text-orange-500 transition-colors"
          >
            Restaurants
          </Link>
          <Link
            to="/menu-items"
            className="text-gray-700 hover:text-orange-500 transition-colors"
          >
            Menu Items
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-orange-500 transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-orange-500 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* User Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-orange-500"
          >
            <FiShoppingCart className="w-6 h-6" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown} // Toggle dropdown on click
                className="flex items-center space-x-1 text-gray-700"
              >
                <FiUser className="w-6 h-6" />
                <span className="font-cabinet">
                  {user?.fullName || user?.name || 'User'}
                </span>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg py-1"
                  style={{ marginTop: '0.5rem' }}
                >
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-700"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            className="text-gray-700 hover:text-orange-500 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
          <div className="flex flex-col space-y-4 px-2">
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-500 transition-colors py-2"
            >
              Home
            </Link>
            <Link
              to="/restaurants"
              className="text-gray-700 hover:text-orange-500 transition-colors py-2"
            >
              Restaurants
            </Link>
            <Link
              to="/menu-items"
              className="text-gray-700 hover:text-orange-500 transition-colors py-2"
            >
              Menu Items
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-orange-500 transition-colors py-2"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-orange-500 transition-colors py-2"
            >
              Contact
            </Link>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-orange-500 flex items-center"
              >
                <FiShoppingCart className="w-6 h-6 mr-2" />
                <span>Cart</span>
                {items.length > 0 && (
                  <span className="ml-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>

              {isAuthenticated && user ? (
                <div className="flex flex-col space-y-2 w-full pt-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FiUser className="w-6 h-6" />
                    <span className="font-cabinet">
                      {user?.fullName || user?.name || 'User'}
                    </span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block w-full py-2 text-gray-700 pl-8"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block w-full py-2 text-gray-700 pl-8"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block w-full py-2 text-gray-700 pl-8"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-gray-700 pl-8"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
