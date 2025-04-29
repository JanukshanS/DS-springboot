/**
 * Environment configuration for the frontend application
 * This file centralizes all environment variables and provides defaults
 */

// Environment configuration for the application
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const isDocker = import.meta.env.VITE_ENVIRONMENT === 'docker';

// Base URLs
const baseApiUrl = isDocker ? 'http://gateway:8080' : 'http://localhost:8080'; // Gateway URL
const localApiUrl = 'http://localhost:8080'; // Use gateway for local development too

// Export API URLs - always route through the gateway
export const API_URL = import.meta.env.VITE_API_URL || localApiUrl;
export const AUTH_URL = `${API_URL}/api/auth`;
export const RESTAURANT_URL = `${API_URL}/api/restaurants`;
export const ORDER_URL = `${API_URL}/api/orders`;
export const PAYMENT_URL = `${API_URL}/api/payments`;
export const USER_URL = `${API_URL}/api/users`;
export const DELIVERY_URL = `${API_URL}/api/deliveries`;
export const NOTIFICATION_URL = `${API_URL}/api/notifications`;

// WebSocket URL for notifications
export const WS_URL = isDocker 
  ? 'ws://gateway:8080/ws' 
  : 'ws://localhost:8080/ws';

// Stripe configuration
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_public_key';

// Application environment
export const ENV = import.meta.env.VITE_ENV || 'development';
export const IS_PRODUCTION = ENV === 'production';
export const IS_DEVELOPMENT = ENV === 'development';

// Feature flags
export const ENABLE_MOCK_API = !IS_PRODUCTION && (import.meta.env.VITE_ENABLE_MOCK_API === 'true' || false);
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || IS_PRODUCTION;

// Application settings
export const APP_NAME = 'Food Delivery Platform';
export const APP_DESCRIPTION = 'Order food from your favorite restaurants';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Default pagination settings
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;

// Timeout settings (in milliseconds)
export const API_TIMEOUT = 30000; // 30 seconds
export const IDLE_TIMEOUT = 1800000; // 30 minutes

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user',
  CART: 'cart',
  RESTAURANT: 'selected_restaurant',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Default language and theme
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_THEME = 'dark';

// Export all environment variables as a single object
export default {
  API_URL,
  AUTH_URL,
  RESTAURANT_URL,
  ORDER_URL,
  PAYMENT_URL,
  USER_URL,
  DELIVERY_URL,
  NOTIFICATION_URL,
  WS_URL,
  STRIPE_PUBLIC_KEY,
  ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  ENABLE_MOCK_API,
  ENABLE_ANALYTICS,
  APP_NAME,
  APP_DESCRIPTION,
  APP_VERSION,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUMBER,
  API_TIMEOUT,
  IDLE_TIMEOUT,
  STORAGE_KEYS,
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
};
