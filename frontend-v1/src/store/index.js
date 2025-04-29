import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import restaurantReducer from './slices/restaurantSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';

// Configure Redux store with all reducers
const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
  // Add middleware for serializable check if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action types to avoid serialization warnings
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
      },
    }),
});

export default store;