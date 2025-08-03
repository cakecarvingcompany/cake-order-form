import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Ensure this path is correct

// IMPORTANT: Ensure no other CSS imports are here.
// For example, delete or comment out lines like:
// import './index.css';
// import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
