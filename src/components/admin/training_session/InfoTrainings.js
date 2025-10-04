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

function InfoTrainings({ token, handleEditTraining }) {
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [coaches, setCoaches] = useState([]);

  const [selectedTrainingTypeId, setSelectedTrainingTypeId] = useState(0);
  const [selectedCoachId, setSelectedCoachId] = useState(0);

  const [trainingsInfo, setTrainingsInfo] = useState([]);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/training_sessions/residents/0/0`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTrainingsInfo(response.data);
      } catch (error) {
        console.error("Error fetching trainings:", error);
        alert("Failed to fetch trainings. Check the console for details.");
      }
    };

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

    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/coaches/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoaches(response.data);
      } catch (error) {
        console.error("Error fetching coaches:", error);
        alert("Failed to fetch coachess. Check the console for details.");
      }
    };

    fetchTrainings();
    fetchTrainingTypes();
    fetchCoaches();
  }, [token]);

  const handleDeleteResidentFromTraining = async (
    residentId,
    trainingSessionId
  ) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/resident_to_training/${residentId}/${trainingSessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      handleTrainingFilter();
      alert("Enrollment cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling enrollment:", error);
      alert("Failed to cancel enrollment. Check the console for details.");
    }
  };

  // const handleEditTraining = () => {
  //   // Заглушка
  // }

  const handleDeleteTraining = async (trainingSessionId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/training_sessions/${trainingSessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTrainingsInfo(
        trainingsInfo.filter((training) => training.id !== trainingSessionId)
      );
      alert("Training deleting cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling training deleting:", error);
      alert("Failed to delete training. Check the console for details.");
    }
  };

  const handleTrainingFilter = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/training_sessions/residents/${selectedTrainingTypeId}/${selectedCoachId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTrainingsInfo(response.data);
    } catch (error) {
      console.error("Error filter trainings:", error);
      alert("Failed to filter trainings. Check the console for details.");
    }
  };

  const handleTrainingTypeChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTrainingTypeId(selectedValue === "all" ? 0 : selectedValue);
  };

  const handleCoachChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCoachId(selectedValue === "all" ? 0 : selectedValue);
  };

  return (
    <div>
      <h2 className="Chapter-title">Информация о тренировках</h2>
      <div className="Select-wrapper">
        <select
          className="Select-combobox"
          onChange={handleTrainingTypeChange}
          value={selectedTrainingTypeId || "all"}
        >
          <option value="all">Выберите вид тренировки</option>
          {trainingTypes.map((trainingType) => (
            <option key={trainingType.id} value={trainingType.id}>
              {trainingType.training_name}
            </option>
          ))}
        </select>
        <select
          className="Select-combobox"
          onChange={handleCoachChange}
          value={selectedCoachId || "all"}
        >
          <option value="all">Выберите тренера</option>
          {coaches.map((coach) => (
            <option key={coach.id} value={coach.id}>
              {coach.surname} {coach.name}
            </option>
          ))}
        </select>
        <button
          className="Select-button"
          onClick={() => handleTrainingFilter()}
        >
          Применить фильтр
        </button>
      </div>
      {trainingsInfo.length > 0 ? (
        <div className="Training-wrapper">
          <div className="Training-list Admin-training-list">
            {trainingsInfo.map((training) => (
              <div
                key={training.id}
                className="Training-item Admin-training-item"
              >
                <div className="Training-info">
                  <div className="Admin-training-title">
                    <button className="Delete-button" onClick={() => handleDeleteTraining(training.id)}>
                      X
                    </button>
                    <button className="Edit-button" onClick={() => handleEditTraining(training.id)}>
                      Изменить
                    </button>
                    
                  </div>
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
                  {training.residents.length > 0 ? (
                    <p><b>Записаны на тренировку:</b></p>
                  ) : (
                    <p>Увы, никто не записан :(</p>
                  )}
                  {training.residents.map((resident) => (
                    <div className="Admin-training-title">
                      <button className="Delete-button"
                        onClick={() =>
                          handleDeleteResidentFromTraining(
                            resident.id,
                            training.id
                          )
                        }
                      >
                        X
                      </button>
                      <p>
                        {resident.surname} {resident.name} (
                        {new Date(resident.birthdate).toLocaleString()})
                      </p>
                    </div>
                  ))}
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

export default InfoTrainings;
