import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Table, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api  from '../../services/authService';

const RoomManagement = () => {
  const { pgId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ roomNumber: '', capacity: 0, price: 0 });
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, [pgId]);

  const fetchRooms = async () => {
    try {
      const response = await api.get(`/pg/rooms/get-rooms/${pgId}`);
      setRooms(response.data);
    } catch (error) {
      toast.error('Failed to fetch rooms');
      console.error(error);
    }
  };

  const handleAddRoom = async () => {
    try {
      await api.post(`/pg/rooms/add-room/${pgId}`, newRoom);
      toast.success('Room added successfully');
      setShowAddModal(false);
      setNewRoom({ roomNumber: '', capacity: 0, price: 0 });
      fetchRooms();
    } catch (error) {
      toast.error('Failed to add room');
      console.error(error);
    }
  };

  const handleUpdateRoom = async () => {
    try {
      await api.put(`/pg/rooms/update-room/${selectedRoom.id}`, selectedRoom);
      toast.success('Room updated successfully');
      setShowUpdateModal(false);
      fetchRooms();
    } catch (error) {
      toast.error('Failed to update room');
      console.error(error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await api.delete(`/pg/rooms/delete-room/${roomId}`);
        toast.success('Room deleted successfully');
        fetchRooms();
      } catch (error) {
        toast.error('Failed to delete room');
        console.error(error);
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2>Manage Rooms for PG ID: {pgId}</h2>
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>Add New Room</Button>
          <Button variant="secondary" className="ms-2" onClick={() => navigate('/owner-dashboard')}>Back to PGs</Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Capacity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.roomNumber}</td>
              <td>{room.capacity}</td>
              <td>{room.price}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => { setSelectedRoom(room); setShowUpdateModal(true); }}>Update</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDeleteRoom(room.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Room Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="form-control mb-2"
            placeholder="Room Number"
            value={newRoom.roomNumber}
            onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
          />
          <input
            className="form-control mb-2"
            type="number"
            placeholder="Capacity"
            value={newRoom.capacity}
            onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 0 })}
          />
          <input
            className="form-control mb-2"
            type="number"
            placeholder="Price"
            value={newRoom.price}
            onChange={(e) => setNewRoom({ ...newRoom, price: parseFloat(e.target.value) || 0 })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddRoom}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Update Room Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="form-control mb-2"
            placeholder="Room Number"
            value={selectedRoom?.roomNumber || ''}
            onChange={(e) => setSelectedRoom({ ...selectedRoom, roomNumber: e.target.value })}
          />
          <input
            className="form-control mb-2"
            type="number"
            placeholder="Capacity"
            value={selectedRoom?.capacity || 0}
            onChange={(e) => setSelectedRoom({ ...selectedRoom, capacity: parseInt(e.target.value) || 0 })}
          />
          <input
            className="form-control mb-2"
            type="number"
            placeholder="Price"
            value={selectedRoom?.price || 0}
            onChange={(e) => setSelectedRoom({ ...selectedRoom, price: parseFloat(e.target.value) || 0 })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateRoom}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RoomManagement;