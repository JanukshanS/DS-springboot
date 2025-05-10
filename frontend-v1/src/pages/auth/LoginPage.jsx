import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';
import { LoginRequest } from '../../models';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Get redirect path from URL params or default to home
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'RESTAURANT_ADMIN') {
        navigate('/restaurant-admin/dashboard');
      } else if (user.role === 'DELIVERY_PERSONNEL') {
        navigate('/delivery/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectPath);
      }
    }
  }, [isAuthenticated, user, navigate, redirectPath]);
  
  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
     // toast.error(error);
     // dispatch(clearError());
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
      
      // Handle specific error messages
      if (name === 'usernameOrEmail' && value.trim() === '') {
        setFormErrors({
          ...formErrors,
          [name]: 'Username or email is required'
        });
      }
    }
  };
  
  const validateForm = () => {
    const loginRequest = LoginRequest.fromCredentials(
      formData.usernameOrEmail,
      formData.password
    );
    
    const errors = loginRequest.validate();
    setFormErrors(errors);
    
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      // If remember me is checked, store email in localStorage
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.usernameOrEmail);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
  
      // Dispatch login action
      dispatch(login(formData)).then((response) => {
        // Assuming login success will store user data in response
        const user = response.payload;
        if (user) {
          // Save user data to localStorage
          localStorage.setItem('userData', JSON.stringify({
            email: user.email,
            id: user.id,
            role: user.role,
            username: user.username,
            type: user.type,
          }));
        }
      });
    }
  };
  
  
  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData((prevData) => ({
        ...prevData,
        usernameOrEmail: rememberedEmail,
      }));
      setRememberMe(true);
    }
  }, []);
  
  return (
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-orange-500 hover:text-orange-400">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="usernameOrEmail"
            name="usernameOrEmail"
            type="text"
            label="Username or Email"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            required
            error={formErrors.usernameOrEmail}
            disabled={loading}
          />

          <div>
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
            <div className="text-sm text-right mt-1">
              <Link
                to="/forgot-password"
                className="font-medium text-orange-500 hover:text-orange-400"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;