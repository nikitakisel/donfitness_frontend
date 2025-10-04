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

function EditTrainingType({ token, trainingTypeId, setActiveTab }) {
  const [trainingName, setTrainingName] = useState("");
  const [description, setDescription] = useState("");

  const handleEditTrainingType = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/training_types/${trainingTypeId}`,
        {
          training_name: trainingName,
          description: description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Данные успешно изменены!");
      setActiveTab("infoTrainingTypes");
    } catch (error) {
      console.error("Edit training type failed:", error);
      alert("Edit training type failed. Check the console for details.");
    }
  };

  useEffect(() => {
    const fetchTrainingType = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/training_types/${trainingTypeId}`,
          {
            training_name: trainingName,
            description: description,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;
        setTrainingName(data.training_name);
        setDescription(data.description);
      } catch (error) {
        console.error("Fetch training type failed:", error);
        alert("Fetch training type failed. Check the console for details.");
      }
    };
    fetchTrainingType();
  }, [token]);

  return (
    <div>
      <h2 className="Chapter-title">Изменить вид тренировки</h2>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleEditTrainingType}>
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
                Сохранить изменения
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTrainingType;
