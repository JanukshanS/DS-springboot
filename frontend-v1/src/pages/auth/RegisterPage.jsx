import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../../store/slices/authSlice';
import { SignupRequest } from '../../models';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    role: 'CUSTOMER',
  });
  const [formErrors, setFormErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'RESTAURANT_ADMIN') {
        navigate('/restaurant-admin/dashboard');
      } else if (user.role === 'DELIVERY_PERSONNEL') {
        navigate('/delivery/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      //toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear field error when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    // Validate the form data using the SignupRequest model
    const signupRequest = SignupRequest.fromUserData(formData);
    const modelErrors = signupRequest.validate();
    
    // Add model validation errors
    Object.assign(errors, modelErrors);
    
    // Additional validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeToTerms) {
      errors.terms = 'You must agree to the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Remove confirmPassword field before sending to the API
      const { confirmPassword, ...registrationData } = formData;
      dispatch(register(registrationData));
    }
  };
  
  return (
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-orange-500 hover:text-orange-400">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <Input
              id="fullName"
              name="fullName"
              type="text"
              label="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              error={formErrors.fullName}
              disabled={loading}
            />
            
            <Input
              id="username"
              name="username"
              type="text"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              required
              error={formErrors.username}
              disabled={loading}
            />
          </div>

          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            error={formErrors.email}
            disabled={loading}
          />
          
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={formErrors.phoneNumber}
            disabled={loading}
          />

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              required
              error={formErrors.password}
              disabled={loading}
            />
            
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={formErrors.confirmPassword}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="role-customer"
                  name="role"
                  type="radio"
                  value="CUSTOMER"
                  checked={formData.role === 'CUSTOMER'}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300"
                />
                <label htmlFor="role-customer" className="ml-3 block text-sm text-gray-700">
                  Customer
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="role-restaurant"
                  name="role"
                  type="radio"
                  value="RESTAURANT_ADMIN"
                  checked={formData.role === 'RESTAURANT_ADMIN'}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300"
                />
                <label htmlFor="role-restaurant" className="ml-3 block text-sm text-gray-700">
                  Restaurant Owner
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="role-delivery"
                  name="role"
                  type="radio"
                  value="DELIVERY_PERSONNEL"
                  checked={formData.role === 'DELIVERY_PERSONNEL'}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300"
                />
                <label htmlFor="role-delivery" className="ml-3 block text-sm text-gray-700">
                  Delivery Driver
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={() => setAgreeToTerms(!agreeToTerms)}
              className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link
                to="/legal/terms"
                className="font-medium text-orange-500 hover:text-orange-400"
              >
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link
                to="/legal/privacy"
                className="font-medium text-orange-500 hover:text-orange-400"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {formErrors.terms && (
            <p className="mt-1 text-sm text-red-600">{formErrors.terms}</p>
          )}

          <div>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;