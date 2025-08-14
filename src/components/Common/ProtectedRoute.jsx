import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuth, role } = useAuth();
  console.log('ProtectedRoute - Role Check:', { isAuth, role, allowedRoles }); // Debug log

  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

export default ProtectedRoute;