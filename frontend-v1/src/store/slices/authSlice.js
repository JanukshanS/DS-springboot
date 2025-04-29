import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth as authService } from '../../services/api';

// Async thunks for authentication
export const login = createAsyncThunk(
  'auth/login',
  async ({ usernameOrEmail, password }, { rejectWithValue }) => {
    try {
      // Authenticate with our backend to get JWT token
      const response = await authService.login({
        usernameOrEmail: usernameOrEmail,
        password
      });

      const { token, refreshToken, ...userData } = response.data;

      // Store tokens in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      return userData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Register with our backend
      const response = await authService.register(userData);
      console.log('Register response:', response);

      const { token, refreshToken, ...newUserData } = response.data;

      // Store tokens in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      return newUserData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Logout from backend
      await authService.logout();

      // Remove tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      return null;
    } catch (error) {
      // Still remove tokens even if backend logout fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      return rejectWithValue(
        error.response?.data?.message || 'Logout failed, but you have been logged out locally.'
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user profile.'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await authService.updateProfile(userData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user profile.'
      );
    }
  }
);

// Helper function to check if token is valid
const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  // If we have a token, we consider it valid for now
  // In a production app, you might want to decode the JWT and check its expiration
  return true;
};

// Initial state
const initialState = {
  isAuthenticated: isTokenValid(),
  user: null,
  loading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    silentLogout: (state) => {
      // Used when we need to log out without redirecting
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle silentLogout action from authActions.js
      .addCase('auth/silentLogout', (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // If we can't get the user profile, we're not authenticated
        if (action.error.message === 'Request failed with status code 401') {
          state.isAuthenticated = false;
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;