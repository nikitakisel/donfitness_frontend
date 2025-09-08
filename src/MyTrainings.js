import API_BASE_URL from './App.js';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyTrainings({ token }) {
  const [myTrainings, setMyTrainings] = useState([]);
  const [residentId, setResidentId] = useState(null);

  useEffect(() => {
    const fetchMyTrainings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training_sessions/enrolled`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyTrainings(response.data);
      } catch (error) {
        console.error('Error fetching my trainings:', error);
        alert('Failed to fetch your trainings. Check the console for details.');
      }
    };

    const fetchResidentId = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = response.data.id;

        const residentResponse = await axios.get(`${API_BASE_URL}/residents/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResidentId(residentResponse.data.id);
      } catch (error) {
        console.error('Error fetching resident ID:', error);
        alert('Failed to fetch resident ID. Check the console for details.');
      }
    };

    fetchMyTrainings();
    fetchResidentId();
  }, [token]);

  const handleCancelEnrollment = async (trainingSessionId) => {
    try {
      if (!residentId) {
        console.error('Resident ID is not available.');
        alert('Resident ID is not available. Please try again.');
        return;
      }
      await axios.delete(`${API_BASE_URL}/resident_to_training/${residentId}/${trainingSessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optimistically update the UI
      setMyTrainings(myTrainings.filter(training => training.id !== trainingSessionId));
      alert('Enrollment cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling enrollment:', error);
      alert('Failed to cancel enrollment. Check the console for details.');
    }
  };

  return (
    <div>
      <h2>My Trainings</h2>
      {myTrainings.length > 0 ? (
        <ul className="Training-list">
          {myTrainings.map((training) => (
            <li key={training.id} className="Training-item">
              {training.training_type} with {training.coach_name} {training.coach_surname} - {new Date(training.start_time).toLocaleString()} ({training.duration} minutes) - Remaining places: {training.remaining_places}/{training.max_capacity}
              <button onClick={() => handleCancelEnrollment(training.id)}>Cancel Enrollment</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You are not currently enrolled in any trainings.</p>
      )}
    </div>
  );
}

export default MyTrainings;