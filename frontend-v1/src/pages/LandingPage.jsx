import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiBriefcase, FiStar, FiMapPin } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Features from '../components/home/Features';
import Testimonials from '../components/home/Testimonials';
import RestaurantPartner from '../components/home/RestaurantPartner';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-20">
        <div className="container mx-auto px-6 z-10 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-rowdies text-white leading-tight mb-6">
                Delicious Food Delivered to Your Doorstep
              </h1>
              <p className="text-xl text-white font-cabinet mb-8 max-w-lg">
                Order from your favorite local restaurants with fast delivery and low fees.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="shadow-lg" onClick={() => navigate('/restaurants')}>
                  Order Now
                </Button>
                <Button variant="outline" size="lg" className="bg-white border-white text-orange-600 hover:bg-orange-50" onClick={() => navigate('/restaurants')}>
                  View Restaurants
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="bg-white p-4 rounded-lg shadow-xl max-w-md mx-auto">
                <div className="relative mb-4">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for food or restaurants"
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-wrap -mx-2 mb-4">
                  <div className="px-2 w-1/2 mb-4">
                    <div className="p-3 bg-orange-50 rounded-md flex items-center">
                      <FiStar className="text-orange-500 mr-2" />
                      <span className="text-sm">Top Rated</span>
                    </div>
                  </div>
                  <div className="px-2 w-1/2 mb-4">
                    <div className="p-3 bg-orange-50 rounded-md flex items-center">
                      <FiClock className="text-orange-500 mr-2" />
                      <span className="text-sm">Fast Delivery</span>
                    </div>
                  </div>
                  <div className="px-2 w-1/2 mb-4">
                    <div className="p-3 bg-orange-50 rounded-md flex items-center">
                      <FiBriefcase className="text-orange-500 mr-2" />
                      <span className="text-sm">Best Deals</span>
                    </div>
                  </div>
                  <div className="px-2 w-1/2 mb-4">
                    <div className="p-3 bg-orange-50 rounded-md flex items-center">
                      <FiMapPin className="text-orange-500 mr-2" />
                      <span className="text-sm">Near You</span>
                    </div>
                  </div>
                </div>
                <Button fullWidth onClick={() => navigate('/restaurants')}>Find Food</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-rowdies font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Getting your favorite food delivered has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-orange-500">1</span>
              </div>
              <h3 className="text-xl font-cabinet font-bold mb-4">Browse Restaurants</h3>
              <p className="text-gray-600">
                Browse through our extensive list of restaurants and cuisines, filter by price, rating, or delivery time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-orange-500">2</span>
              </div>
              <h3 className="text-xl font-cabinet font-bold mb-4">Place Your Order</h3>
              <p className="text-gray-600">
                Select your favorite meals, customize them as needed, and add them to your cart. Checkout with secure payment.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-orange-500">3</span>
              </div>
              <h3 className="text-xl font-cabinet font-bold mb-4">Enjoy Your Food</h3>
              <p className="text-gray-600">
                Track your order in real-time and receive it at your doorstep. Enjoy hot and fresh food delivered to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-rowdies font-bold text-gray-800">
              Popular Categories
            </h2>
            <Button variant="outline" onClick={() => navigate('/restaurants')}>View All</Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {/* Category 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4 text-center">
                <h3 className="font-cabinet font-bold">Pizza</h3>
              </div>
            </div>

            {/* Category 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4 text-center">
                <h3 className="font-cabinet font-bold">Burgers</h3>
              </div>
            </div>

            {/* Category 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4 text-center">
                <h3 className="font-cabinet font-bold">Sushi</h3>
              </div>
            </div>

            {/* Category 4 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4 text-center">
                <h3 className="font-cabinet font-bold">Mexican</h3>
              </div>
            </div>

            {/* Category 5 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4 text-center">
                <h3 className="font-cabinet font-bold">Desserts</h3>
              </div>
            </div>

            {/* Category 6 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4 text-center">
                <h3 className="font-cabinet font-bold">Drinks</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-rowdies font-bold text-gray-800">
              Featured Restaurants
            </h2>
            <Button variant="outline" onClick={() => navigate('/restaurants')}>View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Restaurant 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm py-1 px-3 rounded-full">
                  4.8 ★
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-cabinet font-bold mb-2">Burger King</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <span className="mr-2">Burgers</span>
                  <span>•</span>
                  <span className="mx-2">30-45 min</span>
                  <span>•</span>
                  <span className="ml-2">$$</span>
                </div>
                <Button variant="outline" fullWidth>View Menu</Button>
              </div>
            </div>

            {/* Restaurant 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm py-1 px-3 rounded-full">
                  4.5 ★
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-cabinet font-bold mb-2">Pizza Hut</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <span className="mr-2">Pizza</span>
                  <span>•</span>
                  <span className="mx-2">25-40 min</span>
                  <span>•</span>
                  <span className="ml-2">$$</span>
                </div>
                <Button variant="outline" fullWidth>View Menu</Button>
              </div>
            </div>

            {/* Restaurant 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm py-1 px-3 rounded-full">
                  4.7 ★
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-cabinet font-bold mb-2">Sushi World</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <span className="mr-2">Japanese</span>
                  <span>•</span>
                  <span className="mx-2">40-55 min</span>
                  <span>•</span>
                  <span className="ml-2">$$$</span>
                </div>
                <Button variant="outline" fullWidth>View Menu</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Restaurant Partner Section */}
      <RestaurantPartner />

      {/* App Download Section */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-rowdies font-bold mb-6">
                Download Our Mobile App
              </h2>
              <p className="text-xl mb-8 max-w-md">
                Get exclusive deals and faster ordering with our mobile app.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button className="bg-white text-orange-600 hover:bg-gray-100">
                  App Store
                </Button>
                <Button className="bg-white text-orange-600 hover:bg-gray-100">
                  Google Play
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-2 rounded-xl shadow-xl max-w-sm mx-auto">
                <div className="h-80 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;