import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "../../App.css";

import TrainingsInfo from "./TrainingsInfo";
import AddCoach from "./AddCoach";
import AddTrainingType from "./AddTrainingType";
import AddTrainingSession from "./AddTrainingSession";

function AdminPanel({ token }) {
  const [activeTab, setActiveTab] = useState("trainingsInfo");

  return (
    <div className="Dashboard">
      <nav className="Dashboard-nav">
        <ul className="Dashboard-nav-list">
          <li
            className={
              activeTab === "trainingsInfo"
                ? "active"
                : "Dashboard-nav-list-item"
            }
          >
            <button onClick={() => setActiveTab("trainingsInfo")}>
              Тренировки
            </button>
          </li>
          <li className={activeTab === "addCoach" ? "active" : ""}>
            <button onClick={() => setActiveTab("addCoach")}>+ Тренер</button>
          </li>
          <li className={activeTab === "addTrainingType" ? "active" : ""}>
            <button onClick={() => setActiveTab("addTrainingType")}>
              + Вид тренировки
            </button>
          </li>
          <li className={activeTab === "addTrainingSession" ? "active" : ""}>
            <button onClick={() => setActiveTab("addTrainingSession")}>
              + Тренировка
            </button>
          </li>
        </ul>
      </nav>
      <div className="Dashboard-content">
        {activeTab === "trainingsInfo" && <TrainingsInfo token={token} />}
        {activeTab === "addCoach" && <AddCoach token={token} />}
        {activeTab === "addTrainingType" && <AddTrainingType token={token} />}
        {activeTab === "addTrainingSession" && (
          <AddTrainingSession token={token} />
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
