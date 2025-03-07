import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request Interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request:', config); // Log the request
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  response => {
    console.log('Response:', response); // Log the response
    return response;
  },
  error => {
    console.error('API Error:', error); // Log the error
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
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
