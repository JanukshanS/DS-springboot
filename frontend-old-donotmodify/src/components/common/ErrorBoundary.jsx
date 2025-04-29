import React, { Component } from 'react';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';
import { withRouter } from '../../utils/withRouter';

/**
 * Error boundary component that catches JavaScript errors in its child component tree
 * and displays a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.navigate('/');
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 border border-gray-700">
            <div className="flex items-center mb-4 text-red-500">
              <FaExclamationTriangle className="text-3xl mr-3" />
              <h2 className="text-2xl font-bold">Something went wrong</h2>
            </div>
            
            <p className="text-gray-300 mb-4">
              We're sorry, but an error occurred while rendering this page.
            </p>
            
            {this.state.error && (
              <div className="bg-gray-900 p-4 rounded-lg mb-6 overflow-auto max-h-40">
                <p className="text-red-400 font-mono text-sm">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={this.handleReset}
                className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <FaRedo className="mr-2" />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200"
              >
                <FaHome className="mr-2" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
