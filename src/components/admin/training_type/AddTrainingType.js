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

function AddTrainingType({ token }) {
  const [trainingName, setTrainingName] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTrainingType = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/training_types/`,
        {
          training_name: trainingName,
          description: description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Данные успешно обновлены!");
      setTrainingName("");
      setDescription("");
    } catch (error) {
      console.error("Add coach failed:", error);
      alert("Add coach failed. Check the console for details.");
    }
  };

  useEffect(() => {}, [token]);

  return (
    <div>
      <h2 className="Chapter-title">Добавить вид тренировки</h2>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleAddTrainingType}>
          <div className="Auth-form-content">
            <div className="form-group mt-3">
              <label>Вид тренировки</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Введите вид тренировки"
                value={trainingName}
                onChange={(e) => setTrainingName(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Описание</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Введите описание вида тренировки"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

export default AddTrainingType;
