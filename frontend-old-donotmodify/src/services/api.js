import axios from 'axios';
import {
  API_URL,
  AUTH_URL,
  RESTAURANT_URL,
  ORDER_URL,
  PAYMENT_URL,
  DELIVERY_URL,
  API_TIMEOUT,
  STORAGE_KEYS
} from '../config/env';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: API_TIMEOUT,
  withCredentials: true
});

// Add request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response'
    };
    
    console.error('Response Error:', errorDetails);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Handle forbidden access
          console.warn('Access forbidden:', errorDetails);
          break;
        case 404:
          // Handle not found
          console.warn('Resource not found:', errorDetails);
          break;
        case 500:
          // Handle server error
          console.error('Server error:', errorDetails);
          break;
      }
    }

    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/signin', credentials);
      if (response.data.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        
        // Store user information
        const userData = {
          email: response.data.email,
          name: response.data.name,
          role: response.data.role
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/signup', userData);
      if (response.data.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        
        // Store user information
        const user = {
          email: response.data.email,
          name: response.data.name,
          role: response.data.role
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.RESTAURANT);
    window.location.href = '/login';
  },
  
  getProfile: async () => {
    try {
      const response = await api.get('/api/users/profile');
      return response;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },
  
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/api/users/profile', userData);
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
};

// Restaurant Service
export const restaurantService = {
  getAllRestaurants: () => {
    return api.get('/api/restaurants');
  },
  getRestaurantById: (id) => {
    return api.get(`/api/restaurants/${id}`);
  },
  getMenuItems: (id) => {
    return api.get(`/api/restaurants/${id}/menu`);
  },
  getMyRestaurants: () => {
    return api.get('/api/restaurants/my-restaurants');
  },
  createRestaurant: (restaurantData) => {
    return api.post('/api/restaurants', restaurantData);
  },
  updateRestaurant: (id, restaurantData) => {
    return api.put(`/api/restaurants/${id}`, restaurantData);
  },
  deleteRestaurant: (id) => {
    return api.delete(`/api/restaurants/${id}`);
  },
  updateAvailability: (id, isAvailable) => {
    return api.patch(`/api/restaurants/${id}/availability`, { isAvailable });
  },
  addMenuItem: (restaurantId, menuItemData) => {
    return api.post(`/api/restaurants/${restaurantId}/menu`, menuItemData);
  },
  updateMenuItem: (restaurantId, menuItemId, menuItemData) => {
    return api.put(`/api/restaurants/${restaurantId}/menu/${menuItemId}`, menuItemData);
  },
  deleteMenuItem: (restaurantId, menuItemId) => {
    return api.delete(`/api/restaurants/${restaurantId}/menu/${menuItemId}`);
  }
};

// Order Service
export const orderService = {
  createOrder: (orderData) => {
    return api.post('/api/orders', orderData);
  },
  getOrderById: (id) => {
    return api.get(`/api/orders/${id}`);
  },
  getUserOrders: (userId) => {
    return api.get(`/api/orders/user/${userId}`);
  },
  getRestaurantOrders: (restaurantId) => {
    return api.get(`/api/orders/restaurant/${restaurantId}`);
  },
  updateOrderStatus: (id, status) => {
    return api.put(`/api/orders/${id}/status`, { status });
  },
  cancelOrder: (id) => {
    return api.put(`/api/orders/${id}/cancel`);
  }
};

// Payment Service
export const paymentService = {
  createPaymentIntent: (orderData) => {
    return api.post('/api/payments/create-payment-intent', orderData);
  },
  confirmPayment: (paymentId, paymentData) => {
    return api.post(`/api/payments/${paymentId}/confirm`, paymentData);
  },
  getPaymentById: (id) => {
    return api.get(`/api/payments/${id}`);
  },
  getPaymentHistory: (userId) => {
    return api.get(`/api/payments/user/${userId}`);
  }
};

// Delivery Service
export const deliveryService = {
  getDeliveryById: (id) => {
    return api.get(`/api/deliveries/${id}`);
  },
  getDeliveryByOrderId: (orderId) => {
    return api.get(`/api/deliveries/order/${orderId}`);
  },
  getUserDeliveries: (userId) => {
    return api.get(`/api/deliveries/user/${userId}`);
  },
  updateDeliveryStatus: (id, status, location) => {
    return api.put(`/api/deliveries/${id}/status`, { status, location });
  }
};

export default api;
