import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FoodDelivery</h3>
            <p className="text-gray-300 text-sm">
              The best food delivery platform for your favorite restaurants.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-300 hover:text-white text-sm">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-white text-sm">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Join Us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white text-sm">
                  Register as Customer
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white text-sm">
                  Register as Restaurant
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white text-sm">
                  Register as Delivery Personnel
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: support@fooddelivery.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Main St, City, Country</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} FoodDelivery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
