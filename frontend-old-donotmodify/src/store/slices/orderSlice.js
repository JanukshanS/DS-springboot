import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/api';

// Async thunks for order operations
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update order status');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await orderService.getUserOrders(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user orders');
    }
  }
);

const initialState = {
  currentOrder: null,
  userOrders: [],
  isLoading: false,
  error: null,
  orderConfirmation: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    setOrderConfirmation: (state, action) => {
      state.orderConfirmation = action.payload;
    },
    clearOrderConfirmation: (state) => {
      state.orderConfirmation = null;
    },
    setOrderError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order cases
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orderConfirmation = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create order';
      })
      
      // Fetch order cases
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch order';
      })
      
      // Update order status cases
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        
        // Also update the order in the user orders list if it exists
        const index = state.userOrders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.userOrders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update order status';
      })
      
      // Fetch user orders cases
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch user orders';
      });
  },
});

export const {
  clearCurrentOrder,
  clearOrderError,
  setOrderConfirmation,
  clearOrderConfirmation,
  setOrderError
} = orderSlice.actions;

// Selectors
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectUserOrders = (state) => state.order.userOrders;
export const selectOrderLoading = (state) => state.order.isLoading;
export const selectOrderError = (state) => state.order.error;
export const selectOrderConfirmation = (state) => state.order.orderConfirmation;

export default orderSlice.reducer;