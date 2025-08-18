import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export const setAuthToken = (token) => {
  if (token) {
    Cookies.set('accessToken', token, { secure: true, sameSite: 'strict', expires: 1/24 }); // 1 hour expiry
  } else {
    Cookies.remove('accessToken');
  }
};

export const getAuthToken = () => {
  return Cookies.get('accessToken');
};

export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem('refreshToken', token);
  } else {
    localStorage.removeItem('refreshToken');
  }
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const getUserRole = () => {
  const token = getAuthToken();
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log('getUserRole - Decoded Token:', decoded); // Debug the full decoded object
      const role = decoded.role; // Explicitly extract role
      console.log('getUserRole - Extracted Role:', role); // Debug the extracted role
      return role || null; // Return role or null if undefined
    } catch (error) {
      console.error('JWT Decode Error:', error);
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const logout = () => {
  setAuthToken(null);
  setRefreshToken(null);
  window.location.href = '/';
};