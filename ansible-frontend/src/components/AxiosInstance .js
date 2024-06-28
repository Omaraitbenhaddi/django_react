import axios from 'axios';
import authService from './authService';

// Configure Axios instance
const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
  config => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
      config.headers['Authorization'] = 'Token ' + user.token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
