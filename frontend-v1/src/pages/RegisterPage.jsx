import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiAlertCircle, FiBriefcase } from 'react-icons/fi';
import { registerUser } from '../store/slices/authSlice';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { SignupRequest, UserDTO } from '../models';

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'CUSTOMER',
  });
  const [errors, setErrors] = useState({});

  // Available user roles
  const userRoles = [
    { value: 'CUSTOMER', label: 'Customer' },
    { value: 'RESTAURANT_ADMIN', label: 'Restaurant Admin' },
    { value: 'DELIVERY_PERSONNEL', label: 'Delivery Driver' }
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};

    // Basic validation for required fields
    if (!userData.name) {
      newErrors.name = 'Name is required';
    }

    if (!userData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!userData.password) {
      newErrors.password = 'Password is required';
    } else if (userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!userData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!userData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(userData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!userData.address) {
      newErrors.address = 'Address is required';
    }

    if (!userData.role) {
      newErrors.role = 'Please select a role';
    }

    // Role-specific validations
    if (userData.role === 'RESTAURANT_ADMIN') {
      // Restaurant admins might need additional validation in the future
    } else if (userData.role === 'DELIVERY_PERSONNEL') {
      // Delivery personnel might need additional validation in the future
    }

    // Additional validation using SignupRequest model
    if (Object.keys(newErrors).length === 0) {
      const { confirmPassword, ...registrationData } = userData;
      const signupRequest = SignupRequest.fromUserData(registrationData);
      const modelErrors = signupRequest.validate();

      // Map fullName error to name field for UI display
      if (modelErrors.fullName) {
        newErrors.name = modelErrors.fullName;
      }

      // Map phoneNumber error to phone field for UI display
      if (modelErrors.phoneNumber) {
        newErrors.phone = modelErrors.phoneNumber;
      }

      // Add any other errors from the model validation
      Object.assign(newErrors, modelErrors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = userData;

      // Create a SignupRequest from the form data
      const signupRequest = SignupRequest.fromUserData(registrationData);

      console.log('Registration Data:', signupRequest);
      try {
        await dispatch(registerUser(signupRequest)).unwrap();
        // If registration is successful, redirect to home page
        navigate('/');
      } catch (error) {
        // Error is handled by the Redux slice
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="py-8 px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-rowdies font-bold text-gray-800">Create Account</h2>
                <p className="text-gray-600 mt-2">Sign up to start ordering your favorite food</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <FiAlertCircle className="mr-2" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={userData.address}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="123 Main St, City, State, ZIP"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="role" className="block text-gray-700 text-sm font-semibold mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBriefcase className="text-gray-400" />
                    </div>
                    <select
                      id="role"
                      name="role"
                      value={userData.role}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.role ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    >
                      {userRoles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="mb-6">
                  <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;