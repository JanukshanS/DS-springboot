import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from './store/slices/authSlice';
import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';
import './App.css';
import TestDisplayRestaurants from "./api-test/restaurant";

function App() {
  const dispatch = useDispatch();

  // On app load, check if user is authenticated and fetch profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  return (
    <>
      {/* <AppRouter /> */}
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#22c55e",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
      <TestDisplayRestaurants />
    </>
  );
}

export default App;
