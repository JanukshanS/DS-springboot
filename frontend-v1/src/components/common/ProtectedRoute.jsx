import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute component to handle authentication routing
 * Redirects unauthenticated users to login page with a redirect param
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // If authentication is still loading, show a simple loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with redirect param
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
