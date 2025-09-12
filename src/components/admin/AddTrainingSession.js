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

function AddTrainingSession({ token }) {
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [coaches, setCoaches] = useState([]);

  const [trainingTypeId, setTrainingTypeId] = useState(null);
  const [coachId, setCoachId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");

  const handleAddTrainingSession = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/training_sessions/`,
        {
          training_type_id: trainingTypeId,
          coach_id: coachId,
          start_time: startTime,
          duration: duration,
          max_capacity: maxCapacity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Данные успешно обновлены!");
      setStartTime("");
      setDuration("");
      setMaxCapacity("");
    } catch (error) {
      console.error("Add training session failed:", error);
      alert("Add training session failed. Check the console for details.");
    }
  };

  useEffect(() => {
    const fetchTrainingTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training_types/`, {
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
        console.error("Error fetching training types:", error);
        alert("Failed to fetch training types. Check the console for details.");
      }
    };

    fetchTrainingTypes();
    fetchCoaches();
  }, [token]);

  const handleTrainingTypeChange = (event) => {
    const selectedValue = event.target.value;
    setTrainingTypeId(selectedValue === "all" ? null : selectedValue);
    console.log(trainingTypeId);
  };

  const handleCoachChange = (event) => {
    const selectedValue = event.target.value;
    setCoachId(selectedValue === "all" ? null : selectedValue);
    console.log(coachId);
  };

  return (
    <div>
      <h2 className="Chapter-title">Добавить сеанс тренировки</h2>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleAddTrainingSession}>
          <div className="Auth-form-content">
            <select
              className="Select-combobox"
              onChange={handleTrainingTypeChange}
              value={trainingTypeId || "all"}
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
              value={coachId || "all"}
            >
              <option value="all">Выберите тренера</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.surname} {coach.name}
                </option>
              ))}
            </select>

            <div className="form-group mt-3">
              <label>Время начала тренировки</label>
              <input
                type="datetime-local"
                className="form-control mt-1"
                placeholder="Введите время начала тренировки"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="form-group mt-3">
              <label>Продолжительность</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Укажите длину (в минутах) тренировки"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Вместимость</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Укажите макисмальное число людей"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
              />
            </div>

            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Добавить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTrainingSession;
