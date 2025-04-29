/**
 * Auth actions that can be used outside of the auth slice
 * This file helps break circular dependencies
 */

// Silent logout action - doesn't redirect to login page
export const silentLogout = () => {
  // Remove tokens from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  
  // Return action for the reducer
  return { type: 'auth/silentLogout' };
};
