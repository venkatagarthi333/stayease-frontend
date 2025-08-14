import React from 'react';
import { Link } from 'react-router-dom';
import { logout, getRefreshToken } from '../../utils/auth';
import { logoutUser } from '../../services/authService';
import Cookies from 'js-cookie';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuth, role } = useAuth();

  const handleLogout = async () => {
    const refreshToken = getRefreshToken();
    const accessToken = Cookies.get('accessToken');
    if (refreshToken && accessToken) {
      await logoutUser({ refreshToken }, accessToken);
    }
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">StayEase</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            {isAuth && role === 'ROLE_PILIGRIM' && (
              <li><Link className="nav-link" to="/pilgrim-dashboard">Dashboard</Link></li>
            )}
            {isAuth && role === 'ROLE_PG_OWNER' && (
              <li><Link className="nav-link" to="/owner-dashboard">Dashboard</Link></li>
            )}
            {isAuth && (
              <li><button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;