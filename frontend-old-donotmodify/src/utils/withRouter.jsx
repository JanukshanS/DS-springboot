import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

/**
 * Higher-order component that provides router props to class components
 * This is a replacement for the withRouter HOC that was removed in React Router v6
 */
export const withRouter = (Component) => {
  function ComponentWithRouterProps(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    
    return <Component {...props} navigate={navigate} location={location} params={params} />;
  }
  
  return ComponentWithRouterProps;
};
