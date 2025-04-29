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
      });
  },
});

export const { setFilters, clearFilters, setPage, clearRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;