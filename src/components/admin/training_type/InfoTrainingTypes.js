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

function InfoTrainingTypes({ token, handleEditTrainingType }) {
  const [trainingTypes, setTrainingTypes] = useState([]);

  const handleDeleteTrainingType = async (trainingTypeId) => {
    try {
      await axios.delete(`${API_BASE_URL}/training_types/${trainingTypeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTrainingTypes(trainingTypes.filter((trainingType) => trainingType.id !== trainingTypeId));
      alert("Training type deleting cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling training type deleting:", error);
      alert("Failed to delete training type. Check the console for details.");
    }
  };

  useEffect(() => {
    const fetchTrainingTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training_types/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainingTypes(response.data);
      } catch (error) {
        console.error("Error fetching training types:", error);
        alert("Failed to fetch training types. Check the console for details.");
      }
    };

    fetchTrainingTypes();
  }, [token]);

  return (
    <div>
      <h2 className="Chapter-title">Виды тренировок</h2>
      {trainingTypes.length > 0 ? (
        <div className="Coach-wrapper">
          <div className="Coach-list">
            {trainingTypes.map((trainingType) => (
              <div key={trainingType.id} className="Coach-item">
                {/* <div className="Coach-image"></div> */}
                <div className="Coach-info">
                  <div className="Admin-training-title">
                    <button
                      className="Delete-button"
                      onClick={() => handleDeleteTrainingType(trainingType.id)}
                    >
                      X
                    </button>
                    <button
                      className="Edit-button"
                      onClick={() => handleEditTrainingType(trainingType.id)}
                    >
                      Изменить
                    </button>
                  </div>
                  <h3>
                    {trainingType.training_name}
                  </h3>
                  <p>{trainingType.description}</p>
                </div>
                <div></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No training types available.</p>
      )}
    </div>
  );
}

export default InfoTrainingTypes;
