import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Logo from '../common/Logo';

/**
 * AuthLayout component for authentication pages
 * Provides a clean, focused layout for login/registration
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo className="h-12" />
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm font-medium text-orange-500 hover:text-orange-400">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;