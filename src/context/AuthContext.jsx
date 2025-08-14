import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserRole, isAuthenticated } from '../utils/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [role, setRole] = useState(getUserRole());

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      const userRole = getUserRole();
      if (auth !== isAuth || userRole !== role) { // Only update if changed
        setIsAuth(auth);
        setRole(userRole);
        console.log('AuthContext - Updated State:', { isAuth: auth, role: userRole }); // Debug log
      }
    };

    checkAuth(); // Initial check
    const interval = setInterval(checkAuth, 500); // Reduced to 500ms for quicker updates
    return () => clearInterval(interval); // Cleanup
  }, [isAuth, role]); // Add dependencies to re-run on state change

  return (
    <AuthContext.Provider value={{ isAuth, role, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);