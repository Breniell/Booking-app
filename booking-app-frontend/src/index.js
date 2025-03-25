import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './dist/output.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Styles globaux (exemple avec styled-components)
import { createGlobalStyle } from 'styled-components';

// Thème
export const theme = {
  colors: {
    primary: '#5E35B1',  // Violet professionnel
    secondary: '#00BFA5', // Turquoise moderne
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#D84315',
    text: {
      primary: '#212121',
      secondary: '#757575'
    }
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  animations: {
    fadeIn: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slideUp: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background: ${theme.colors.background};
    font-family: 'Inter', -apple-system, system-ui;
    color: ${theme.colors.text.primary};
  }
  
  .glass-effect {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="VOTRE_CLIENT_ID_GOOGLE">
      <GlobalStyles /> {/* Ajoutez les styles globaux ici */}
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);