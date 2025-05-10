import axios from 'axios';
import API_CONFIG from '../config/api.config';
import { silentLogout } from '../store/actions/authActions';

// Create axios instances for each service
const createApiService = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 30000, // 30 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - adds auth token to requests
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handles token refresh and errors
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if the request is for a public endpoint (restaurant browsing, etc.)
      // Added a safety check to ensure originalRequest.url exists before checking includes
      const isPublicEndpoint = originalRequest && originalRequest.url ? (
        originalRequest.url.includes('/api/restaurants') ||
        originalRequest.url.includes('/api/menu-items') ||
        originalRequest.url.includes('/api/reviews')
      ) : false;

      // If error is 401 (Unauthorized) and we haven't already tried to refresh
      // and it's not a public endpoint (we don't want to redirect from public pages)
      if (error.response?.status === 401 && !originalRequest._retry && !isPublicEndpoint) {
        originalRequest._retry = true;

        try {
          // Try to refresh the token
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post(
            `${API_CONFIG.auth.baseUrl}${API_CONFIG.auth.endpoints.refreshToken}`,
            { refreshToken }
          );

          // Save the new tokens
          const { token, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Update the failed request's Authorization header and retry
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // If refresh fails, log out the user
          if (isPublicEndpoint) {
            // For public endpoints, use silent logout (no redirect)
            silentLogout();
          } else {
            // For protected endpoints, do a full logout with redirect
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create service instances
const authService = createApiService(API_CONFIG.auth.baseUrl);
const userService = createApiService(API_CONFIG.user.baseUrl);
const restaurantService = createApiService(API_CONFIG.restaurant.baseUrl);
const orderService = createApiService(API_CONFIG.order.baseUrl);
const paymentService = createApiService(API_CONFIG.payment.baseUrl);
const deliveryService = createApiService(API_CONFIG.delivery.baseUrl);
const notificationService = createApiService(API_CONFIG.notification.baseUrl);

// Helper to format URL with path parameters
const formatUrl = (url, params = {}) => {
  let formattedUrl = url;
  Object.keys(params).forEach((key) => {
    formattedUrl = formattedUrl.replace(`{${key}}`, params[key]);
  });
  return formattedUrl;
};

// Auth API methods
export const auth = {
  login: (data) => authService.post(API_CONFIG.auth.endpoints.login, data),
  register: (data) => authService.post(API_CONFIG.auth.endpoints.register, data),
  logout: () => authService.post(API_CONFIG.auth.endpoints.logout),
  forgotPassword: (email) => authService.post(API_CONFIG.auth.endpoints.forgotPassword, { email }),
  resetPassword: (data) => authService.post(API_CONFIG.auth.endpoints.resetPassword, data),
  getCurrentUser: () => authService.get(API_CONFIG.auth.endpoints.me),
};

// User API methods
export const user = {
  getProfile: () => userService.get(API_CONFIG.user.endpoints.profile),
  updateProfile: (data) => userService.put(API_CONFIG.user.endpoints.updateProfile, data),
  // Add method to update a specific user by ID
  updateUser: (id, data) => userService.put(`/api/users/${id}`, data),
  changePassword: (data) => userService.post(API_CONFIG.user.endpoints.changePassword, data),
  getAddresses: () => userService.get(API_CONFIG.user.endpoints.addresses),
  addAddress: (data) => userService.post(API_CONFIG.user.endpoints.addresses, data),
  updateAddress: (id, data) => userService.put(`${API_CONFIG.user.endpoints.addresses}/${id}`, data),
  deleteAddress: (id) => userService.delete(`${API_CONFIG.user.endpoints.addresses}/${id}`),
  getPaymentMethods: () => userService.get(API_CONFIG.user.endpoints.paymentMethods),
  addPaymentMethod: (data) => userService.post(API_CONFIG.user.endpoints.paymentMethods, data),
  deletePaymentMethod: (id) => userService.delete(`${API_CONFIG.user.endpoints.paymentMethods}/${id}`),
};

// Restaurant API methods
export const restaurant = {
  getAll: (params) =>
    restaurantService.get(API_CONFIG.restaurant.endpoints.list, { params }),
  getAllActive: () =>
    restaurantService.get(API_CONFIG.restaurant.endpoints.list),
  getAllRestaurants: () =>
    restaurantService.get(API_CONFIG.restaurant.endpoints.allRestaurants),
  getById: (id) =>
    restaurantService.get(
      formatUrl(API_CONFIG.restaurant.endpoints.details, { id })
    ),
  createRestaurant: (data) =>
    restaurantService.post(
      API_CONFIG.restaurant.endpoints.createRestaurant,
      data
    ),
  updateRestaurant: (id, data) =>
    restaurantService.put(
      formatUrl(API_CONFIG.restaurant.endpoints.updateRestaurant, { id }),
      data
    ),
  deleteRestaurant: (id) =>
    restaurantService.delete(
      formatUrl(API_CONFIG.restaurant.endpoints.deleteRestaurant, { id })
    ),

  // Menu items
  getMenu: (restaurantId) =>
    restaurantService.get(
      formatUrl(API_CONFIG.restaurant.endpoints.menu, { restaurantId })
    ),
  getMenuAll: (restaurantId) =>
    restaurantService.get(
      formatUrl(API_CONFIG.restaurant.endpoints.menuAll, { restaurantId })
    ),
  getMenuByCategory: (restaurantId, category) =>
    restaurantService.get(
      formatUrl(API_CONFIG.restaurant.endpoints.menuByCategory, {
        restaurantId,
        category,
      })
    ),
  getMenuDietary: (restaurantId) =>
    restaurantService.get(
      formatUrl(API_CONFIG.restaurant.endpoints.menuDietary, { restaurantId })
    ),
  getMenuItem: (id) =>
    restaurantService.get(
      formatUrl(API_CONFIG.restaurant.endpoints.menuItem, { id })
    ),
  getAllMenuItems: () =>
    restaurantService.get(API_CONFIG.restaurant.endpoints.allMenuItems),
  updateMenuItemAvailability: (id, available) =>
    restaurantService.patch(
      formatUrl(API_CONFIG.restaurant.endpoints.menuItemAvailability, { id }),
      null,
      { params: { available } }
    ),

  createMenuItem: (data) =>
    restaurantService.post(
      API_CONFIG.restaurant.endpoints.createMenuItem,
      data
    ),
  updateMenuItem: (id, data) =>
    restaurantService.put(
      formatUrl(API_CONFIG.restaurant.endpoints.updateMenuItem, { id }),
      data
    ),
  deleteMenuItem: (id) =>
    restaurantService.delete(
      formatUrl(API_CONFIG.restaurant.endpoints.deleteMenuItem, { id })
    ),

  // Cuisine
  getCuisines: () =>
    restaurantService.get(API_CONFIG.restaurant.endpoints.cuisines),
  getRestaurantsByCuisine: (cuisineType) =>
    restaurantService.get(
      formatUrl(API_CONFIG.restaurant.endpoints.cuisineType, { cuisineType })
    ),

  // Reviews
  getReviews: (restaurantId, params) =>
    restaurantService.get(
      formatUrl(API_CONFIG.restaurant.endpoints.reviews, { restaurantId }),
      { params }
    ),
  getReviewsSorted: (restaurantId) =>
    restaurantService.get(
      formatUrl(API_CONFIG.restaurant.endpoints.reviewsSorted, { restaurantId })
    ),
  getReviewsByRating: (restaurantId, minRating) =>
    restaurantService.get(
      formatUrl(API_CONFIG.restaurant.endpoints.reviewsByRating, {
        restaurantId,
      }),
      { params: { minRating } }
    ),

  // Search
  search: (query) =>
    restaurantService.get(API_CONFIG.restaurant.endpoints.search, {
      params: { query },
    }),
};

// Order API methods
export const order = {
  create: (data) => orderService.post(API_CONFIG.order.endpoints.create, data),
  getAll: (params) => orderService.get(API_CONFIG.order.endpoints.list, { params }),
  getById: (id) => orderService.get(formatUrl(API_CONFIG.order.endpoints.details, { id })),
  cancel: (id) => orderService.post(formatUrl(API_CONFIG.order.endpoints.cancel, { id })),
  getUserOrders: (userId, params) => orderService.get(formatUrl(API_CONFIG.order.endpoints.userOrders, { userId }), { params }),
  getRestaurantOrders: (restaurantId, params) => orderService.get(formatUrl(API_CONFIG.order.endpoints.restaurantOrders, { restaurantId }), { params }),
};

// Payment API methods
export const payment = {
  process: (data) => paymentService.post(API_CONFIG.payment.endpoints.process, data),
  verify: (paymentId) => paymentService.get(`${API_CONFIG.payment.endpoints.verify}/${paymentId}`),
  getHistory: (params) => paymentService.get(API_CONFIG.payment.endpoints.history, { params }),
};

// Delivery API methods
export const delivery = {
  track: (id) => deliveryService.get(formatUrl(API_CONFIG.delivery.endpoints.track, { id })),
  updateStatus: (id, status) => deliveryService.put(formatUrl(API_CONFIG.delivery.endpoints.update, { id }), { status }),
  assign: (data) => deliveryService.post(API_CONFIG.delivery.endpoints.assign, data),
  getAvailable: () => deliveryService.get(API_CONFIG.delivery.endpoints.available),
};

// Notification API methods
export const notification = {
  updateSettings: (data) => notificationService.put(API_CONFIG.notification.endpoints.settings, data),
  getHistory: (params) => notificationService.get(API_CONFIG.notification.endpoints.history, { params }),
};

// Export a default object with all services
export default {
  auth,
  user,
  restaurant,
  order,
  payment,
  delivery,
  notification,
};
