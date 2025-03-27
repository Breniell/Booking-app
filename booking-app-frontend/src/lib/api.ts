// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://booking-app-backend-2tla.onrender.com/api',
  
  // 'http://localhost:5000/api'
  // Vous pouvez activer d'autres options ici si besoin
});

// Intercepteur de requêtes : ajoute le token si présent
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request:', config);
  return config;
});

// Intercepteur de réponses : redirige sur /login uniquement pour les endpoints protégés
api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    if (error.response) {
      // Définir les endpoints publics pour lesquels on ne veut pas de redirection automatique
      const publicEndpoints = ['/services', '/blog', '/how-it-works', '/users/register'];
      const requestUrl = error.response.config.url || '';
      const isPublic = publicEndpoints.some(endpoint => requestUrl.startsWith(endpoint));

      if (!isPublic && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (error.response.status === 404) {
        console.error('Resource not found:', error.response.data);
      } else if (error.response.status >= 500) {
        console.error('Server error:', error.response.data);
      }
    } else {
      console.error('Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
