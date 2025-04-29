import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiShoppingBag, FiShoppingCart, FiClock, FiLogOut } from 'react-icons/fi';
import { logout } from '../store/slices/authSlice';
import Layout from '../components/layout/Layout';

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const dashboardItems = [
    {
      title: 'Browse Restaurants',
      description: 'Explore restaurants and order your favorite food',
      icon: <FiShoppingBag className="text-white text-2xl" />,
      bgColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
      iconBg: 'bg-blue-500',
      onClick: () => navigate('/restaurants')
    },
    {
      title: 'My Cart',
      description: 'View your cart and checkout',
      icon: <FiShoppingCart className="text-white text-2xl" />,
      bgColor: 'bg-gradient-to-br from-green-600 to-green-700',
      iconBg: 'bg-green-500',
      onClick: () => navigate('/cart')
    },
    {
      title: 'Order History',
      description: 'View your past orders and track current deliveries',
      icon: <FiClock className="text-white text-2xl" />,
      bgColor: 'bg-gradient-to-br from-purple-600 to-purple-700',
      iconBg: 'bg-purple-500',
      onClick: () => navigate('/orders')
    },
    {
      title: 'My Profile',
      description: 'Update your profile and preferences',
      icon: <FiUser className="text-white text-2xl" />,
      bgColor: 'bg-gradient-to-br from-orange-600 to-orange-700',
      iconBg: 'bg-orange-500',
      onClick: () => navigate('/profile')
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-rowdies font-bold text-gray-800 mb-2">
            Welcome, {user?.fullName || user?.name || 'Food Lover'}!
          </h1>
          <p className="text-gray-600">What would you like to do today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {dashboardItems.map((item, index) => (
            <div
              key={index}
              className={`${item.bgColor} rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              onClick={item.onClick}
            >
              <div className={`flex items-center justify-center w-16 h-16 ${item.iconBg} rounded-full mb-4 mx-auto`}>
                {item.icon}
              </div>
              <h2 className="text-xl font-cabinet font-bold text-white text-center mb-2">{item.title}</h2>
              <p className="text-white text-opacity-80 text-center">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            className="flex items-center mx-auto bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            onClick={handleLogout}
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboardPage;
