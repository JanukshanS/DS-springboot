import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './store';
import './index.css';
import './firebase' // Initialize Firebase

// Load Leaflet CSS for maps
import { loadLeafletCSS } from './services/mapService'
loadLeafletCSS()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
