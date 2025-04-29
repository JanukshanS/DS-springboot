
import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaShoppingCart, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import DashboardHeader from "../../components/user/menuTop";
import { authService } from '../../services/api';

function UserDashboard() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen">
            <DashboardHeader />

            <div className="container mx-auto px-4 py-8 pt-32">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'User'}!</h1>
                    <p className="text-gray-400">What would you like to do today?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {/* Restaurants Card */}
                    <div
                        className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        onClick={() => navigate('/user/restaurants')}
                    >
                        <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4 mx-auto">
                            <FaUtensils className="text-white text-2xl" />
                        </div>
                        <h2 className="text-xl font-bold text-center mb-2">Restaurants</h2>
                        <p className="text-indigo-200 text-center">Browse restaurants and order your favorite food</p>
                    </div>

                    {/* Cart Card */}
                    <div
                        className="bg-gradient-to-br from-green-900 to-green-700 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        onClick={() => navigate('/user/cart')}
                    >
                        <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4 mx-auto">
                            <FaShoppingCart className="text-white text-2xl" />
                        </div>
                        <h2 className="text-xl font-bold text-center mb-2">Cart</h2>
                        <p className="text-green-200 text-center">View your cart and checkout</p>
                    </div>

                    {/* Activity Card */}
                    <div
                        className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        onClick={() => navigate('/user/activity')}
                    >
                        <div className="flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4 mx-auto">
                            <FaHistory className="text-white text-2xl" />
                        </div>
                        <h2 className="text-xl font-bold text-center mb-2">Activity</h2>
                        <p className="text-purple-200 text-center">View your order history and payment details</p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <button
                        className="flex items-center mx-auto bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
