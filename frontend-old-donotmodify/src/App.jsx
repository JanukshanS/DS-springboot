import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import LoginCard from './components/authenticationComponents/loginCard'
import Register from './components/auth/Register'
import UserDashboard from './pages/user/dashboard'
import RestaurantList from './pages/user/UserSeeResturants'
import RestaurantDetail from './components/restaurant/RestaurantDetail'
import Cart from './pages/user/CartPage'
import Activity from './pages/user/activityPage'
import Checkout from './components/order/Checkout'
import OrderConfirmation from './components/order/OrderConfirmation'
import ErrorBoundary from './components/common/ErrorBoundary'
import { authService } from './services/api'
import './App.css'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // This runs once when the component mounts
    const checkAuth = () => {
      const user = authService.getCurrentUser();
      if (user) {
        setIsAuthorized(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []); // Empty dependency array ensures it only runs once

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // This runs once when the component mounts
    const user = authService.getCurrentUser();
    setIsAuthenticated(!!user);
  }, []); // Empty dependency array ensures it only runs once

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <Router>
        <ErrorBoundary>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginCard setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />

            {/* Restaurant routes */}
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />

            {/* Protected user routes */}
            <Route path="/user" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />

            <Route path="/user/restaurants" element={
              <ProtectedRoute>
                <RestaurantList />
              </ProtectedRoute>
            } />

            <Route path="/user/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />

            <Route path="/user/activity" element={
              <ProtectedRoute>
                <Activity />
              </ProtectedRoute>
            } />

            {/* Order and checkout routes */}
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />

            <Route path="/orders/:id/confirmation" element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            } />

            {/* Fallback route for any unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </div>
  )
}

export default App
