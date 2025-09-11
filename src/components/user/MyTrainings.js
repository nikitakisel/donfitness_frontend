import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "../../App.css";

const API_BASE_URL = "http://localhost:8000";

function MyTrainings({ token }) {
  const [myTrainings, setMyTrainings] = useState([]);
  const [residentId, setResidentId] = useState(null);

  useEffect(() => {
    const fetchMyTrainings = async () => {
      try {
        console.log(API_BASE_URL);
        const response = await axios.get(
          `${API_BASE_URL}/training_sessions/enrolled`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMyTrainings(response.data);
      } catch (error) {
        console.error("Error fetching my trainings:", error);
        alert("Failed to fetch your trainings. Check the console for details.");
      }
    };

    const fetchResidentId = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = response.data.id;

        const residentResponse = await axios.get(
          `${API_BASE_URL}/residents/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setResidentId(residentResponse.data.id);
      } catch (error) {
        console.error("Error fetching resident ID:", error);
        alert("Failed to fetch resident ID. Check the console for details.");
      }
    };

    fetchMyTrainings();
    fetchResidentId();
  }, [token]);

  const handleCancelEnrollment = async (trainingSessionId) => {
    try {
      if (!residentId) {
        console.error("Resident ID is not available.");
        alert("Resident ID is not available. Please try again.");
        return;
      }
      await axios.delete(
        `${API_BASE_URL}/resident_to_training/${residentId}/${trainingSessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Optimistically update the UI
      setMyTrainings(
        myTrainings.filter((training) => training.id !== trainingSessionId)
      );
      alert("Enrollment cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling enrollment:", error);
      alert("Failed to cancel enrollment. Check the console for details.");
    }
  };

  return (
    <div>
      <h2 className="Chapter-title">Мои тренировки</h2>
      {myTrainings.length > 0 ? (
        <div className="Training-wrapper">
          <div className="Training-list">
            {myTrainings.map((training) => (
              <div key={training.id} className="Training-item">
                <div className="Training-fields Training-fields-my-trainings"></div>
                <div className="Training-info">
                  <h3>{training.training_type}</h3>
                  <p>
                    {training.coach_name} {training.coach_surname}
                  </p>
                  <p>
                    {new Date(training.start_time).toLocaleString()} (
                    {training.duration} минут)
                  </p>
                  <p>
                    Свободно мест: {training.remaining_places} из{" "}
                    {training.max_capacity}
                  </p>
                  <button onClick={() => handleCancelEnrollment(training.id)}>
                    Отменить запись
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>You are not currently enrolled in any trainings.</p>
      )}
    </div>
  );
}

export default MyTrainings;
