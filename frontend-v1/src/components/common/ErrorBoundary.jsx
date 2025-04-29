import React, { Component } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree
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
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FiAlertTriangle className="text-orange-500 text-6xl" />
            </div>
            <h1 className="text-3xl font-rowdies font-bold text-gray-800 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're sorry, but there was an error loading this page. Please try refreshing or contact support if the problem persists.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg"
              >
                Refresh Page
              </button>
              <div>
                <a 
                  href="/" 
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Return to Home
                </a>
              </div>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left overflow-auto max-h-96">
                <p className="text-red-600 font-bold mb-2">Error Details:</p>
                <p className="text-gray-800 mb-2">{this.state.error.toString()}</p>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
