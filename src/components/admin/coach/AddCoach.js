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

function AddCoach({ token }) {
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [qualification, setQualification] = useState("");
  const [extraInfo, setExtraInfo] = useState("");

  const handleAddCoach = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/coaches/`,
        {
          surname: surname,
          name: name,
          speciality: speciality,
          qualification: qualification,
          extra_info: extraInfo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Данные успешно обновлены!");
      setSurname("");
      setName("");
      setSpeciality("");
      setQualification("");
      setExtraInfo("");
    } catch (error) {
      console.error("Add coach failed:", error);
      alert("Add coach failed. Check the console for details.");
    }
  };

  useEffect(() => {}, [token]);

  return (
    <div>
      <h2 className="Chapter-title">Добавить тренера</h2>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleAddCoach}>
          <div className="Auth-form-content">
            <div className="form-group mt-3">
              <label>Фамилия</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Введите фамилию"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Имя</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Введите имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Специализация</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Введите специализацию"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Квалификация</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Укажите уровень квалификации"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Доп. информация</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Укажите доп. информацию"
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
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

export default AddCoach;
