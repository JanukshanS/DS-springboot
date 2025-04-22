import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: '',
  total: 0,
};

// Helper function to calculate total
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { restaurantId, restaurantName, item } = action.payload;

      // If cart is empty or adding from same restaurant
      if (!state.restaurantId || state.restaurantId === restaurantId) {
        // Set restaurant info if cart is empty
        if (!state.restaurantId) {
          state.restaurantId = restaurantId;
          state.restaurantName = restaurantName;
        }

        // Check if item already exists in cart
        const existingItemIndex = state.items.findIndex(
          (cartItem) => cartItem.id === item.id
        );

        if (existingItemIndex !== -1) {
          // Increment quantity if item exists
          state.items[existingItemIndex].quantity += 1;
        } else {
          // Add new item with quantity 1
          state.items.push({ ...item, quantity: 1 });
        }

        // Recalculate total
        state.total = calculateTotal(state.items);
      } else {
        // If adding from a different restaurant, show error or handle as needed
        console.error('Cannot add items from different restaurants');
      }
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);

      // If cart becomes empty, reset restaurant info
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = '';
      }

      // Recalculate total
      state.total = calculateTotal(state.items);
    },
    updateItemQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      
      // Find the item to update
      const itemToUpdate = state.items.find((item) => item.id === itemId);
      
      if (itemToUpdate) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items = state.items.filter((item) => item.id !== itemId);
          
          // If cart becomes empty, reset restaurant info
          if (state.items.length === 0) {
            state.restaurantId = null;
            state.restaurantName = '';
          }
        } else {
          // Update quantity
          itemToUpdate.quantity = quantity;
        }
        
        // Recalculate total
        state.total = calculateTotal(state.items);
      }
    },
    clearCart: (state) => {
      // Reset cart to initial state
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = '';
      state.total = 0;
    },
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;