import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import { setAuthToken } from '../../utils/auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_PILIGRIM');  // Default role
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await register({ email, password, role });
      setAuthToken(token);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="ROLE_PILIGRIM">Pilgrim</option>
            <option value="ROLE_PG_OWNER">PG Owner</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;