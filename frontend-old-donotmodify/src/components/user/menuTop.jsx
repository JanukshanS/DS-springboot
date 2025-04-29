import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUtensils, FaShoppingCart, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { authService } from '../../services/api';

const DashboardHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="bg-white bg-opacity-5 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center">
            <Link to="/user" className="text-xl font-bold text-yellow-400">
              EATO.com
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link
                to="/user"
                className="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/user/restaurants"
                className="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium flex items-center"
              >
                <FaUtensils className="mr-1" />
                Restaurants
              </Link>
              <Link
                to="/user/cart"
                className="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium flex items-center"
              >
                <FaShoppingCart className="mr-1" />
                Cart
              </Link>
              <Link
                to="/user/activity"
                className="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium flex items-center"
              >
                <FaHistory className="mr-1" />
                Activity
              </Link>
            </nav>
          </div>

          {/* Right side - User profile */}
          <div className="flex items-center">
            {/* Profile dropdown */}
            <div className="ml-4 relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <FaUser />
                </div>
                <span className="hidden md:inline ml-2 text-white">
                  {user?.name || 'User'}
                </span>
                <svg
                  className="hidden md:block ml-1 h-4 w-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 shadow-md">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              to="/user"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/user/restaurants"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUtensils className="mr-2" />
              Restaurants
            </Link>
            <Link
              to="/user/cart"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaShoppingCart className="mr-2" />
              Cart
            </Link>
            <Link
              to="/user/activity"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaHistory className="mr-2" />
              Activity
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 flex items-center"
            >
              <FaSignOutAlt className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;