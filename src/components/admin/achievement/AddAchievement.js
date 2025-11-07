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

// Переименованный компонент для добавления достижения
function AddAchievement({ token }) {
  // Состояния для полей достижения
  const [achievementName, setAchievementName] = useState("");
  const [description, setDescription] = useState("");
  const [criteria, setCriteria] = useState(""); // Новое поле для критериев

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/achievements/`, // Измененный эндпоинт
        {
          achievement_name: achievementName, // Имя поля соответствует бэкенду
          description: description,
          criteria: criteria, // Новое поле
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Достижение успешно добавлено!"); // Измененное сообщение
      // Очистка формы после успешного добавления
      setAchievementName("");
      setDescription("");
      setCriteria("");
    } catch (error) {
      console.error("Add achievement failed:", error); // Измененное сообщение об ошибке
      alert("Не удалось добавить достижение. Проверьте консоль для деталей."); // Измененное сообщение
    }
  };

  useEffect(() => {
    // Этот useEffect можно использовать для загрузки данных или других действий при изменении токена
    // В данном случае он пуст, но оставлен для примера
  }, [token]);

  return (
    <div>
      <h2 className="Chapter-title">Добавить достижение</h2> {/* Измененный заголовок */}
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleAddAchievement}>
          <div className="Auth-form-content">
            <div className="form-group mt-3">
              <label>Название достижения</label> {/* Измененная метка */}
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Введите название достижения" // Измененный плейсхолдер
                value={achievementName}
                onChange={(e) => setAchievementName(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Описание</label> {/* Метка остается, но смысл меняется */}
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Введите описание достижения" // Измененный плейсхолдер
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group mt-3"> {/* Новое поле для критериев */}
              <label>Критерии</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Введите критерии получения достижения"
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
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

export default AddAchievement; // Измененный экспорт