// main.jsx - Entry point for React application
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Create root element and render the App component
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// File explanation:
// 1. Import React and ReactDOM for rendering
// 2. Import main App component
// 3. Import global CSS styles
// 4. Create root DOM element and render App component
// 5. StrictMode enables additional checks and warnings in development

// This file is the entry point that Vite uses to build the application
// It connects the React component tree to the HTML DOM