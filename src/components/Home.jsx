import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const Home = () => {
  return (
    <Container className="mt-5 text-center">
      <h1>Welcome to StayEase Hostel App</h1>
      <p>Please choose an option to get started:</p>
      <Button as={Link} to="/login" variant="primary" className="me-3">Log In</Button>
      <Button as={Link} to="/register" variant="success">Register</Button>
    </Container>
  );
};

export default Home;