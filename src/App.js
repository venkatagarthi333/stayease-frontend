import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PilgrimDashboard from './components/Pilgrim/PilgrimDashboard';
import OwnerDashboard from './components/Owner/OwnerDashboard';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Navbar from './components/Common/Navbar';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuth, role } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/pilgrim-dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_PILIGRIM']}>
              <PilgrimDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner-dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_PG_OWNER']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {isAuth ? (
                role === 'ROLE_PILGRIM' ? (
                  <PilgrimDashboard />
                ) : role === 'ROLE_PG_OWNER' ? (
                  <OwnerDashboard />
                ) : (
                  <Navigate to="/unauthorized" />
                )
              ) : (
                <Navigate to="/login" />
              )}
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;