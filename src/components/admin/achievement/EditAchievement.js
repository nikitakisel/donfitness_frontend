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

function EditAchievement({ token, achievementId, setActiveTab }) {
  const [achievementName, setAchievementName] = useState("");
  const [description, setDescription] = useState("");
  const [criteria, setCriteria] = useState("");

  const handleEditAchievement = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/achievements/${achievementId}`,
        {
          achievement_name: achievementName,
          description: description,
          criteria: criteria,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Данные успешно изменены!");
      setActiveTab("infoAchievements"); // Предполагаем, что есть вкладка для отображения информации о достижениях
    } catch (error) {
      console.error("Edit achievement failed:", error);
      alert("Edit achievement failed. Check the console for details.");
    }
  };

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/achievements/${achievementId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;
        setAchievementName(data.achievement_name);
        setDescription(data.description);
        setCriteria(data.criteria);
      } catch (error) {
        console.error("Fetch achievement failed:", error);
        alert("Fetch achievement failed. Check the console for details.");
      }
    };
    fetchAchievement();
  }, [token, achievementId]); // Добавлен achievementId в список зависимостей

  return (
    <div>
      <h2 className="Chapter-title">Изменить достижение</h2>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleEditAchievement}>
          <div className="Auth-form-content">
            <div className="form-group mt-3">
              <label>Название достижения</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Введите название достижения"
                value={achievementName}
                onChange={(e) => setAchievementName(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Описание</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Введите описание достижения"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Критерии</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Введите критерии достижения"
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
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

export default EditAchievement;