import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PilgrimDashboard = () => {
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/hostels');  // Your backend endpoint
        setHostels(response.data);
      } catch (err) {
        console.error('Error fetching hostels');
      }
    };
    fetchHostels();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Pilgrim Dashboard</h2>
      <ul>
        {hostels.map((hostel) => (
          <li key={hostel.id}>{hostel.name} - {hostel.location}</li>
        ))}
      </ul>
      {/* Add booking form or other features */}
    </div>
  );
};

export default PilgrimDashboard;