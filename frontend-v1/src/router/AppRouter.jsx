import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from './../store/slices/authSlice';

// Layout Components
import MainLayout from './../components/layout/MainLayout';
import AuthLayout from './../components/layout/AuthLayout';
import DashboardLayout from './../components/layout/DashboardLayout';

// Public Pages
import LandingPage from './../pages/LandingPage';
import LoginPage from './../pages/auth/LoginPage';
import RegisterPage from './../pages/auth/RegisterPage';
import ForgotPasswordPage from './../pages/ForgotPasswordPage';
// import ResetPasswordPage from './../pages/ResetPasswordPage';
import RestaurantsPage from './../pages/RestaurantsPage';
import RestaurantDetailsPage from './../pages/RestaurantDetailsPage';
import MenuItemsPage from "./../pages/MenuItemsPage";
// import AboutPage from './../pages/AboutPage';
// import ContactPage from './../pages/ContactPage';

// Protected Customer Pages
import ProfilePage from './../pages/user/ProfilePage';
import CartPage from './../pages/user/CartPage';
import CheckoutPage from './../pages/user/CheckoutPage';
import OrderHistoryPage from './../pages/OrderHistoryPage';
import OrderDetailsPage from './../pages/user/OrderDetailsPage';
import AddressesPage from './../pages/user/AddressesPage';
import PaymentMethodsPage from './../pages/user/PaymentMethodsPage';

// Protected Restaurant Admin Pages
import RestaurantRoutes from "./routes/Restaurant_routes";

// Protected Delivery Personnel Pages
import DeliveryDashboard from './../pages/delivery/DashboardPage';
import DeliveryCurrentOrder from './../pages/delivery/CurrentOrderPage';
import DeliveryOrderHistory from "./../pages/delivery/OrderHistoryPage";
// import DeliverySettings from './../pages/delivery/SettingsPage';

// Protected Route Component
import ProtectedRoute from "./../components/common/ProtectedRoute";

// Not Found Page
// import NotFoundPage from './../pages/NotFoundPage';

const AppRouter = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Fetch user profile on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
          <Route path="/menu-items" element={<MenuItemsPage />} />
          {/* <Route path="/about" element={<AboutPage />} /> */}
          {/* <Route path="/contact" element={<ContactPage />} /> */}
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
        </Route>

        {/* Protected Customer Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<ProfilePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="payment-methods" element={<PaymentMethodsPage />} />
        </Route>

        {/* Protected Restaurant Admin Routes */}
        <Route
          path="/restaurant-admin/*"
          element={
            <ProtectedRoute>
              {user && user.role === "RESTAURANT_ADMIN" ? (
                <DashboardLayout />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        >
          <Route path="*" element={<RestaurantRoutes />} />
        </Route>

        {/* Protected Delivery Personnel Routes */}
        <Route
          path="/delivery"
          element={
            <ProtectedRoute>
              {user && user.role === "DELIVERY_PERSONNEL" ? (
                <DashboardLayout />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DeliveryDashboard />} />
          <Route path="current-order" element={<DeliveryCurrentOrder />} />
          <Route path="order-history" element={<DeliveryOrderHistory />} />
          {/* <Route path="settings" element={<DeliverySettings />} /> */}
        </Route>

        {/* Not Found Route */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
