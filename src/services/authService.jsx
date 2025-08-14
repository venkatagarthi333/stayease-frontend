import axios from 'axios';
import { setAuthToken, logout } from '../utils/auth'; // Add these imports
import Cookies from 'js-cookie'; // Add this import

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in requests
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken'); // Now Cookies is defined
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          setAuthToken(response.data.accessToken); // Now setAuthToken is defined
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          logout(); // Now logout is defined
        }
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logoutUser = async (requestBody, accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  await api.post('/auth/logout', requestBody, config);
};