import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { order as orderService } from '../../services/api';

// Async thunks for order operations
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderService.create(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create order.'
      );
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders.'
      );
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order details.'
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.cancel(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel order.'
      );
    }
  }
);

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// Order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.success = 'Order placed successfully!';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.items || action.payload;
        
        // Update pagination if available
        if (action.payload.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination,
          };
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      // Fetch order details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update the current order if it matches the cancelled order
        if (state.currentOrder && state.currentOrder.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
        
        // Update the order in the orders list
        state.orders = state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        );
        
        state.success = 'Order cancelled successfully!';
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { clearError, clearSuccess, setPage, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;