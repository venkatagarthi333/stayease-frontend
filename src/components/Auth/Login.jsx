import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { setAuthToken, setRefreshToken, getUserRole } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';
import { Form, Button } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      setAuthToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setIsAuth(true); // Update auth state
      const newRole = getUserRole(); // Debug: Check the role
      console.log('Login - New Role:', newRole); // Debug log
      // Remove setRole call since it's not available here
      // Use setTimeout as a temporary workaround to allow context to update
      setTimeout(() => navigate('/dashboard'), 100); // Delay navigation
    } catch (err) {
      setError('Invalid credentials');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>
        <Button variant="primary" type="submit">Login</Button>
      </Form>
    </div>
  );
};

export default Login;