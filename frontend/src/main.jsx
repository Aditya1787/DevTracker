import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { GitHubProvider } from './contexts/GitHubContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <GitHubProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </GitHubProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
