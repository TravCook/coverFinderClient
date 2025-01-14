import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import path for React 18
import './index.css';
import App from './App';
import { Provider } from 'react-redux'; // Import the AppProvider
import store from './redux/store/store'

// Create a root element and render the app
const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot to create the root

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
