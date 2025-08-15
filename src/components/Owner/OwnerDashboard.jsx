import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Table, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAuthToken } from '../../utils/auth';
import  api  from '../../services/authService';

const OwnerDashboard = () => {
  const [hostels, setHostels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [newHostel, setNewHostel] = useState({ hostelName: '', location: '', contactNumber: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await api.get('/pg/my-hostels');
      setHostels(response.data);
    } catch (error) {
      toast.error('Failed to fetch hostels');
      console.error(error);
    }
  };

  const handleAddHostel = async () => {
    try {
      await api.post('/pg/add-hostel', newHostel);
      toast.success('Hostel added successfully');
      setShowAddModal(false);
      setNewHostel({ hostelName: '', location: '', contactNumber: '' });
      fetchHostels();
    } catch (error) {
      toast.error('Failed to add hostel');
      console.error(error);
    }
  };

  const handleUpdateHostel = async () => {
    try {
      await api.put(`/pg/update-hostel/${selectedHostel.id}`, selectedHostel);
      toast.success('Hostel updated successfully');
      setShowUpdateModal(false);
      fetchHostels();
    } catch (error) {
      toast.error('Failed to update hostel');
      console.error(error);
    }
  };

  const handleDeleteHostel = async (hostelId) => {
    if (window.confirm('Are you sure you want to delete this hostel?')) {
      try {
        await api.delete(`/pg/delete-hostel/${hostelId}`);
        toast.success('Hostel deleted successfully');
        fetchHostels();
      } catch (error) {
        toast.error('Failed to delete hostel');
        console.error(error);
      }
    }
  };

  const handleManageRooms = (hostelId) => {
    navigate(`/owner-dashboard/pg/${hostelId}/rooms`);
  };

  return (
    <Container className="mt-5">
      <h2>Owner Dashboard</h2>
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>Add New PG</Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hostels.map((hostel) => (
            <tr key={hostel.id}>
              <td>{hostel.hostelName}</td>
              <td>{hostel.location}</td>
              <td>{hostel.contactNumber}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => { setSelectedHostel(hostel); setShowUpdateModal(true); }}>Update</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDeleteHostel(hostel.id)}>Delete</Button>{' '}
                <Button variant="info" size="sm" onClick={() => handleManageRooms(hostel.id)}>Manage Rooms</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Hostel Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New PG</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="form-control mb-2"
            placeholder="Hostel Name"
            value={newHostel.hostelName}
            onChange={(e) => setNewHostel({ ...newHostel, hostelName: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Location"
            value={newHostel.location}
            onChange={(e) => setNewHostel({ ...newHostel, location: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Contact Number"
            value={newHostel.contactNumber}
            onChange={(e) => setNewHostel({ ...newHostel, contactNumber: e.target.value })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddHostel}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Update Hostel Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update PG</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="form-control mb-2"
            placeholder="Hostel Name"
            value={selectedHostel?.hostelName || ''}
            onChange={(e) => setSelectedHostel({ ...selectedHostel, hostelName: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Location"
            value={selectedHostel?.location || ''}
            onChange={(e) => setSelectedHostel({ ...selectedHostel, location: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Contact Number"
            value={selectedHostel?.contactNumber || ''}
            onChange={(e) => setSelectedHostel({ ...selectedHostel, contactNumber: e.target.value })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateHostel}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OwnerDashboard;