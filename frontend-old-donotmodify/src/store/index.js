import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer,
  },
  // Add middleware for development tools if needed
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;