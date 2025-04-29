import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const loadRestaurantFromStorage = () => {
  try {
    const savedRestaurant = localStorage.getItem('restaurant');
    return savedRestaurant ? JSON.parse(savedRestaurant) : null;
  } catch (error) {
    console.error('Error loading restaurant from localStorage:', error);
    return null;
  }
};

const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const saveRestaurantToStorage = (restaurant) => {
  localStorage.setItem('restaurant', JSON.stringify(restaurant));
};

const initialState = {
  items: loadCartFromStorage(),
  restaurant: loadRestaurantFromStorage(),
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { item } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex >= 0) {
        // Item exists in cart, increment quantity
        state.items[existingItemIndex].quantity += 1;
      } else {
        // Item doesn't exist in cart, add with quantity 1
        state.items.push({ ...item, quantity: 1 });
      }
      
      // Save to local storage
      saveCartToStorage(state.items);
    },
    removeItem: (state, action) => {
      const { itemId } = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      
      // If cart is empty, remove restaurant info
      if (state.items.length === 0) {
        state.restaurant = null;
        localStorage.removeItem('restaurant');
      }
      
      // Save to local storage
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === itemId);
      
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity = quantity;
        
        // If quantity is 0, remove the item
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== itemId);
        }
      }
      
      // Save to local storage
      saveCartToStorage(state.items);
    },
    incrementQuantity: (state, action) => {
      const { itemId } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === itemId);
      
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += 1;
      }
      
      // Save to local storage
      saveCartToStorage(state.items);
    },
    decrementQuantity: (state, action) => {
      const { itemId } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === itemId);
      
      if (itemIndex >= 0) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.id !== itemId);
        }
      }
      
      // Save to local storage
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurant = null;
      
      // Clear from local storage
      localStorage.removeItem('cart');
      localStorage.removeItem('restaurant');
    },
    setRestaurant: (state, action) => {
      state.restaurant = action.payload;
      
      // Save to local storage
      saveRestaurantToStorage(action.payload);
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  setRestaurant,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartTotalAmount = (state) => state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectRestaurant = (state) => state.cart.restaurant;

export default cartSlice.reducer;