import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { restaurant as restaurantService } from '../../services/api';

// Async thunks for restaurant operations
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await restaurantService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch restaurants.'
      );
    }
  }
);

export const fetchRestaurantDetails = createAsyncThunk(
  'restaurants/fetchRestaurantDetails',
  async (id, { rejectWithValue }) => {
    try {
      // Get restaurant details
      const detailsResponse = await restaurantService.getById(id);

      // Initialize data structure with restaurant details
      const restaurantData = {
        ...detailsResponse.data,
        menuItems: [],
        cuisines: [],
        reviews: []
      };

      // Try to get menu items - don't fail if this fails
      try {
        const menuResponse = await restaurantService.getMenu(id);
        restaurantData.menuItems = menuResponse.data;
      } catch (menuError) {
        console.warn('Failed to fetch menu items:', menuError);
      }

      // Try to get cuisine types - don't fail if this fails
      try {
        const cuisinesResponse = await restaurantService.getCuisines();
        restaurantData.cuisines = cuisinesResponse.data;
      } catch (cuisineError) {
        console.warn('Failed to fetch cuisines:', cuisineError);
      }

      // Try to get reviews - don't fail if this fails
      try {
        const reviewsResponse = await restaurantService.getReviewsSorted(id);
        restaurantData.reviews = reviewsResponse.data;
      } catch (reviewError) {
        console.warn('Failed to fetch reviews:', reviewError);
      }

      return restaurantData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch restaurant details.'
      );
    }
  }
);

// Async thunk for creating a menu item
export const createMenuItem = createAsyncThunk(
  'restaurants/createMenuItem',
  async ({ restaurantId, menuItemData }, { rejectWithValue }) => {
    try {
      // Ensure data includes the restaurant ID if needed by the backend
      const dataToSend = { ...menuItemData, restaurantId }; 
      const response = await restaurantService.createMenuItem(dataToSend);
      return response.data; // Return the newly created menu item
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create menu item.'
      );
    }
  }
);

// Async thunk for updating a menu item
export const updateMenuItem = createAsyncThunk(
  'restaurants/updateMenuItem',
  async ({ id, menuItemData }, { rejectWithValue }) => {
    try {
      const response = await restaurantService.updateMenuItem(id, menuItemData);
      return response.data; // Return the updated menu item
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update menu item.'
      );
    }
  }
);

// Async thunk for deleting a menu item
export const deleteMenuItem = createAsyncThunk(
  'restaurants/deleteMenuItem',
  async (id, { rejectWithValue }) => {
    try {
      await restaurantService.deleteMenuItem(id);
      return id; // Return the ID of the deleted item
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete menu item.'
      );
    }
  }
);

// Initial state
const initialState = {
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null,
  filters: {
    cuisine: null,
    priceLevel: null,
    rating: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// Restaurant slice
const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      // Reset to first page when filters change
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        cuisine: null,
        priceLevel: null,
        rating: null,
      };
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearRestaurant: (state) => {
      state.currentRestaurant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch restaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload.items || action.payload;

        // Update pagination if available
        if (action.payload.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination,
          };
        }
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // Fetch restaurant details
      .addCase(fetchRestaurantDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // Create Menu Item
      .addCase(createMenuItem.pending, (state) => {
        state.loading = true; // Or a specific loading state like state.menuItemLoading = true
        state.error = null;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new menu item to the current restaurant's menu if loaded
        if (state.currentRestaurant && state.currentRestaurant.menuItems) {
          state.currentRestaurant.menuItems.push(action.payload);
        }
        // Optionally, you might want to add it to a general menu item list if you have one
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create menu item';
      })

      // Update Menu Item
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        // Update the menu item in the current restaurant's menu if loaded
        if (state.currentRestaurant && state.currentRestaurant.menuItems) {
          const index = state.currentRestaurant.menuItems.findIndex(
            (item) => item.id === action.payload.id
          );
          if (index !== -1) {
            state.currentRestaurant.menuItems[index] = action.payload;
          }
        }
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update menu item';
      })

      // Delete Menu Item
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the menu item from the current restaurant's menu if loaded
        if (state.currentRestaurant && state.currentRestaurant.menuItems) {
          state.currentRestaurant.menuItems = state.currentRestaurant.menuItems.filter(
            (item) => item.id !== action.payload // action.payload is the ID
          );
        }
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete menu item';
      });
  },
});

export const { setFilters, clearFilters, setPage, clearRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;