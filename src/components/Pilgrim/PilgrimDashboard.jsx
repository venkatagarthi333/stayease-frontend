import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../services/authService';

const PilgrimDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hostels, setHostels] = useState([]);
  const [selectedHostelId, setSelectedHostelId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Flag for initial load
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch booking on initial load without triggering modal or toast
    const fetchInitialBooking = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/pilgrim/my-booking');
        const data = response.data;
        setBookingDetails(data);
      } catch (error) {
        console.error('Failed to fetch initial booking details:', error);
        setBookingDetails(null);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false); // Mark initial load as complete
      }
    };
    fetchInitialBooking();
  }, []); // Runs once on mount

  const fetchMyBooking = useCallback(async () => {
    if (isLoading) return; // Prevent multiple calls if already loading
    setIsLoading(true);
    try {
      const response = await api.get('/pilgrim/my-booking');
      const data = response.data;
      setBookingDetails(data);
      if (data && data.roomId) {
        setShowBookingDetails(true); // Show modal only on manual click
      } else {
        toast.info('No active booking found.', { autoClose: 3000 }); // Toast only on manual click
      }
    } catch (error) {
      toast.error('Failed to fetch booking details');
      console.error(error);
      setBookingDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get(`/pilgrim/search?location=${searchTerm}`);
      setHostels(response.data);
    } catch (error) {
      toast.error('Failed to search hostels');
      console.error(error);
    }
  };

  const handleViewRooms = async (hostelId) => {
    try {
      const response = await api.get(`/pilgrim/rooms/${hostelId}`);
      setRooms(response.data);
      setSelectedHostelId(hostelId);
    } catch (error) {
      toast.error('Failed to fetch rooms');
      console.error(error);
    }
  };

  const handleBookRoom = async (roomId) => {
    try {
      const response = await api.post(`/pilgrim/book/${roomId}`);
      setBookingDetails(response.data);
      setShowBookingDetails(true);
      setRooms([]);
      fetchMyBooking(); // Refresh current booking
    } catch (error) {
      if (error.response && error.response.status === 500 && error.message.includes('Duplicate entry')) {
        toast.error('Failed to book room: Room is already booked or you have an existing booking.');
      } else {
        toast.error('Failed to book room');
      }
      console.error(error);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await api.delete('/pilgrim/cancel-booking');
      toast.success('Booking cancelled successfully');
      setBookingDetails(null);
      setShowBookingDetails(false);
    } catch (error) {
      toast.error('Failed to cancel booking: No active booking or error occurred');
      console.error(error);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Pilgrim Dashboard</h2>
      <Row className="mb-3">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search by area"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">Search</Button>
          </Form>
        </Col>
        <Col md={6} className="text-end">
          <Button
            variant="info"
            onClick={fetchMyBooking}
            disabled={isLoading}
            className="me-2"
          >
            View Booking
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelBooking}
            disabled={!bookingDetails || !bookingDetails.roomId || isLoading}
          >
            Cancel Booking
          </Button>
        </Col>
      </Row>
      <Row>
        {hostels.map((hostel) => (
          <Col md={4} key={hostel.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{hostel.hostelName}</Card.Title>
                <Card.Text>
                  Location: {hostel.location}<br />
                  Contact: {hostel.contactNumber}
                </Card.Text>
                <Button variant="info" onClick={() => handleViewRooms(hostel.id)}>View Rooms</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {rooms.length > 0 && (
        <Row className="mt-3">
          <h3>Rooms for Selected PG</h3>
          {rooms.map((room) => (
            <Col md={4} key={room.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>Room {room.roomNumber}</Card.Title>
                  <Card.Text>
                    Room Type:{room.bedType}<br/>
                    Capacity: {room.capacity}<br/>
                    Available Beds:{room.availableBeds}<br/>
                    Price: ${room.price}
                  </Card.Text>
                  <Button variant="success" onClick={() => handleBookRoom(room.id)}>Book</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Booking Details Modal */}
      <Modal show={showBookingDetails} onHide={() => setShowBookingDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingDetails && bookingDetails.roomId ? (
            <>
              <p><strong>Pilgrim ID:</strong> {bookingDetails.pilgrimId}</p>
              <p><strong>Hostel Name:</strong> {bookingDetails.hostelName}</p>
              <p><strong>Location:</strong> {bookingDetails.location}</p>
              <p><strong>Contact:</strong> {bookingDetails.contactNumber}</p>
              <p><strong>Room Number:</strong> {bookingDetails.roomNumber}</p>
              <p><strong>Capacity:</strong> {bookingDetails.capacity}</p>
              <p><strong>Price:</strong> ${bookingDetails.price}</p>
              <p><strong>Pilgrim Email:</strong> {bookingDetails.pilgrimEmail}</p>
            </>
          ) : (
            <p>No active booking details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingDetails(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PilgrimDashboard;