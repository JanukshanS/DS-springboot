import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave, FiAlertCircle } from 'react-icons/fi';
import { updateUserProfile } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (profileData.phoneNumber && !/^\+?[0-9]{10,15}$/.test(profileData.phoneNumber.replace(/[\s-]/g, ''))) {
      errors.phoneNumber = 'Phone number is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (validateProfileForm()) {
      try {
        await dispatch(updateUserProfile(profileData)).unwrap();
        toast.success('Profile updated successfully');
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        toast.error(error || 'Failed to update profile');
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      try {
        await dispatch(updateUserProfile({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })).unwrap();
        
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        toast.success('Password updated successfully');
        setSuccessMessage('Password updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        toast.error(error || 'Failed to update password');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'profile'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'password'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('password')}
        >
          Password
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 flex items-center">
          <FiCheckCircle className="mr-2" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
          <FiAlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-gray-700 text-sm font-semibold mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="John Doe"
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
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
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-semibold mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  {formErrors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        formErrors.address ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="123 Main St, City, Country"
                    />
                  </div>
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <form onSubmit={handlePasswordSubmit}>
              {/* Current Password */}
              <div className="mb-6">
                <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      formErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                </div>
                {formErrors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="mb-6">
                <label htmlFor="newPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      formErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                </div>
                {formErrors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.newPassword}</p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>

              <div className="mt-8">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;