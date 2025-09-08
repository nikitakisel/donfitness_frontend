import API_BASE_URL from './App.js';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AllTrainings({ token }) {
  const [allTrainings, setAllTrainings] = useState([]);
  const [residentId, setResidentId] = useState(null);

  useEffect(() => {
    const fetchAllTrainings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training_sessions/not_enrolled`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllTrainings(response.data);
      } catch (error) {
        console.error('Error fetching all trainings:', error);
        alert('Failed to fetch all trainings. Check the console for details.');
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

    fetchAllTrainings();
    fetchResidentId();
  }, [token]);

  const handleEnroll = async (trainingSessionId) => {
    try {
      if (!residentId) {
        console.error('Resident ID is not available.');
        alert('Resident ID is not available. Please try again.');
        return;
      }
      await axios.post(`${API_BASE_URL}/resident_to_training/`, {
        resident_id: residentId,
        training_session_id: trainingSessionId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //Optimistically update the UI
      setAllTrainings(allTrainings.filter(training => training.id !== trainingSessionId));
      alert('Successfully enrolled!');
    } catch (error) {
      console.error('Error enrolling in training:', error);
      alert('Failed to enroll in training. Check the console for details.');
    }
  };

  return (
    <div>
      <h2>All Trainings</h2>
      {allTrainings.length > 0 ? (
        <ul className="Training-list">
          {allTrainings.map((training) => (
            <li key={training.id} className="Training-item">
              {training.training_type} with {training.coach_name} {training.coach_surname} - {new Date(training.start_time).toLocaleString()} ({training.duration} minutes) - Remaining places: {training.remaining_places}/{training.max_capacity}
              <button onClick={() => handleEnroll(training.id)}>Enroll</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No trainings available.</p>
      )}
    </div>
  );
}

export default AllTrainings;