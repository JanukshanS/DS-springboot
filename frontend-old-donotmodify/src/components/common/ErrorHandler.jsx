import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaSignInAlt, FaHome, FaRedo } from 'react-icons/fa';

/**
 * Error handler component that displays different error messages based on the error type
 * and provides actions to recover from the error
 */
const ErrorHandler = ({ error, resetError }) => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setVisible(true);
    }
  }, [error]);

  // If no error or error is hidden, don't render anything
  if (!error || !visible) {
    return null;
  }

  // Determine error type and message
  let title = 'Error';
  let message = 'An unexpected error occurred.';
  let actions = [];

  if (error.response) {
    // Server responded with an error status
    const status = error.response.status;

    if (status === 401) {
      title = 'Authentication Required';
      message = 'You need to log in to access this resource.';
      actions = [
        {
          label: 'Log In',
          icon: <FaSignInAlt />,
          action: () => navigate('/login'),
          primary: true
        },
        {
          label: 'Go Home',
          icon: <FaHome />,
          action: () => navigate('/')
        }
      ];
    } else if (status === 403) {
      title = 'Access Denied';
      message = 'You do not have permission to access this resource.';
      actions = [
        {
          label: 'Go Home',
          icon: <FaHome />,
          action: () => navigate('/'),
          primary: true
        }
      ];
    } else if (status === 404) {
      title = 'Not Found';
      message = 'The requested resource could not be found.';
      actions = [
        {
          label: 'Go Home',
          icon: <FaHome />,
          action: () => navigate('/'),
          primary: true
        }
      ];
    } else if (status >= 500) {
      title = 'Server Error';
      message = 'The server encountered an error. Please try again later.';
      actions = [
        {
          label: 'Try Again',
          icon: <FaRedo />,
          action: resetError,
          primary: true
        },
        {
          label: 'Go Home',
          icon: <FaHome />,
          action: () => navigate('/')
        }
      ];
    }
  } else if (error.message === 'Network Error') {
    title = 'Network Error';
    message = 'Unable to connect to the server. Please check your internet connection.';
    actions = [
      {
        label: 'Try Again',
        icon: <FaRedo />,
        action: resetError,
        primary: true
      },
      {
        label: 'Go Home',
        icon: <FaHome />,
        action: () => navigate('/')
      }
    ];
  }

  // Add a dismiss action if none exists
  if (actions.length === 0) {
    actions = [
      {
        label: 'Dismiss',
        action: () => setVisible(false),
        primary: true
      }
    ];
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 border border-gray-700">
        <div className="flex items-center mb-4 text-yellow-500">
          <FaExclamationTriangle className="text-2xl mr-2" />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        
        <p className="text-gray-300 mb-6">{message}</p>
        
        <div className="flex flex-wrap gap-3 justify-end">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`flex items-center px-4 py-2 rounded-lg ${
                action.primary
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorHandler;
