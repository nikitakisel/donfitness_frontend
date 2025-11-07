import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "../../../App.css";

const API_BASE_URL = "http://localhost:8000";

function InfoCoaches({ token, handleEditCoach }) {
  const [coaches, setCoaches] = useState([]);

  const handleDeleteCoach = async (coachId) => {
    try {
      await axios.delete(`${API_BASE_URL}/coaches/${coachId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCoaches(coaches.filter((coach) => coach.id !== coachId));
      alert("Coach deleting cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling coach deleting:", error);
      alert("Failed to delete coach. Check the console for details.");
    }
  };

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/coaches/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoaches(response.data);
      } catch (error) {
        console.error("Error fetching coaches:", error);
        alert("Failed to fetch coaches. Check the console for details.");
      }
    };

    fetchCoaches();
  }, [token]);

  return (
    <div>
      <h2 className="Chapter-title">Тренеры</h2>
      {coaches.length > 0 ? (
        <div className="Coach-wrapper">
          <div className="Coach-list">
            {coaches.map((coach) => (
              <div key={coach.id} className="Coach-item">
                <div className="Coach-image Coach-img"></div>
                <div className="Coach-info">
                  <div className="Admin-training-title">
                    <button
                      className="Delete-button"
                      onClick={() => handleDeleteCoach(coach.id)}
                    >
                      X
                    </button>
                    <button
                      className="Edit-button"
                      onClick={() => handleEditCoach(coach.id)}
                    >
                      Изменить
                    </button>
                  </div>
                  <h3>
                    {coach.surname} {coach.name}
                  </h3>
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

export default InfoCoaches;
