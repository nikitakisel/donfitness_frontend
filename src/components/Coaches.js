import API_BASE_URL from '../App.js';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Coaches({ token }) {
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/coaches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoaches(response.data);
      } catch (error) {
        console.error('Error fetching coaches:', error);
        alert('Failed to fetch coaches. Check the console for details.');
      }
    };

    fetchCoaches();
  }, [token]);

  return (
    <div>
      <h2>Coaches</h2>
      {coaches.length > 0 ? (
        <ul className="Coach-list">
          {coaches.map((coach) => (
            <li key={coach.id} className="Coach-item">
              <h3>{coach.name} {coach.surname}</h3>
              <p>Speciality: {coach.speciality}</p>
              <p>Qualification: {coach.qualification}</p>
              <p>Extra Info: {coach.extra_info}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No coaches available.</p>
      )}
    </div>
  );
}

export default Coaches;