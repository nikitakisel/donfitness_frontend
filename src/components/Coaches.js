import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import '../App.css';

const API_BASE_URL = 'http://localhost:8000';


function Coaches({ token }) {
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/coaches/all`, {
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
      <h2>Тренеры</h2>
      {coaches.length > 0 ? (
        <div className="Coach-wrapper">
          <div className="Coach-list">
            {coaches.map((coach) => (
              <div key={coach.id} className="Coach-item">
                <div className="Coach-image"></div>
                <div className="Coach-info">
                  <h3>{coach.name} {coach.surname}</h3>
                <p>{coach.speciality}</p>
                <p>{coach.qualification}</p>
                <p>Примечание: {coach.extra_info}</p>
                </div>
                <div></div>
              </div>
            ))}
          </div>
        </div>
        
      ) : (
        <p>No coaches available.</p>
      )}
    </div>
  );
}

export default Coaches;