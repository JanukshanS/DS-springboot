/**
 * API configuration for microservices
 * This file contains the base URLs and endpoints for each microservice
 */

// Base URLs from environment variables
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';
const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8080';
const RESTAURANT_SERVICE_URL = import.meta.env.VITE_RESTAURANT_SERVICE_URL || 'http://localhost:8080';
const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8080';
const PAYMENT_SERVICE_URL = import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8080';
const DELIVERY_SERVICE_URL = import.meta.env.VITE_DELIVERY_SERVICE_URL || 'http://localhost:8080';
const NOTIFICATION_SERVICE_URL = import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:8080';

// API Endpoints configuration
const API_CONFIG = {
  auth: {
    baseUrl: API_GATEWAY_URL,
    endpoints: {
      login: "/api/auth/signin",
      register: "/api/auth/signup",
      refreshToken: "/api/auth/refresh-token",
      forgotPassword: "/api/auth/forgot-password",
      resetPassword: "/api/auth/reset-password",
      logout: "/api/auth/logout",
      me: "/api/users/me",
    },
  },
  user: {
    baseUrl: USER_SERVICE_URL,
    endpoints: {
      profile: "/api/users/profile",
      updateProfile: "/api/users/profile",
      changePassword: "/api/users/change-password",
      addresses: "/api/users/addresses",
      paymentMethods: "/api/users/payment-methods",
    },
  },
  restaurant: {
    baseUrl: RESTAURANT_SERVICE_URL,
    endpoints: {
      list: "/api/restaurants",
      details: "/api/restaurants/{id}",
      menu: "/api/menu-items/restaurant/{restaurantId}",
      menuAll: "/api/menu-items/restaurant/{restaurantId}/all",
      menuByCategory:
        "/api/menu-items/restaurant/{restaurantId}/category/{category}",
      menuDietary: "/api/menu-items/restaurant/{restaurantId}/dietary",
      menuItem: "/api/menu-items/{id}",
      menuItemAvailability: "/api/menu-items/{id}/availability",
      allMenuItems: "/api/menu-items",
      allRestaurants: "/api/restaurants/all",
      cuisines: "/api/restaurants/cuisines",
      cuisineType: "/api/restaurants/cuisine/{cuisineType}",
      reviews: "/api/reviews/restaurant/{restaurantId}",
      reviewsSorted: "/api/reviews/restaurant/{restaurantId}/sorted",
      reviewsByRating: "/api/reviews/restaurant/{restaurantId}/rating",
      search: "/api/restaurants/search",
    },
  },
  order: {
    baseUrl: ORDER_SERVICE_URL,
    endpoints: {
      create: "/api/orders",
      list: "/api/orders",
      details: "/api/orders/{id}",
      cancel: "/api/orders/{id}/cancel",
      userOrders: "/api/users/{userId}/orders",
      restaurantOrders: "/api/restaurants/{restaurantId}/orders",
    },
  },
  payment: {
    baseUrl: PAYMENT_SERVICE_URL,
    endpoints: {
      process: "/api/payments/process",
      verify: "/api/payments/verify",
      history: "/api/payments/history",
    },
  },
  delivery: {
    baseUrl: DELIVERY_SERVICE_URL,
    endpoints: {
      track: "/api/delivery/track/{id}",
      update: "/api/delivery/{id}/status",
      assign: "/api/delivery/assign",
      available: "/api/delivery/available",
      myDeliveries: "/api/deliveries/my-deliveries",
    },
  },
  notification: {
    baseUrl: NOTIFICATION_SERVICE_URL,
    endpoints: {
      settings: "/api/notifications/settings",
      history: "/api/notifications/history",
    },
  },
};

export default API_CONFIG;