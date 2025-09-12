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

import News from "./News";
import AllTrainings from "./AllTrainings";
import Coaches from "./Coaches";
import MyTrainings from "./MyTrainings";
import MyProfile from "./MyProfile";

function Dashboard({ token }) {
  const [activeTab, setActiveTab] = useState("news");

  return (
    <div className="Dashboard">
      <nav className="Dashboard-nav">
        <ul className="Dashboard-nav-list">
          <li className={activeTab === "news" ? "active" : "Dashboard-nav-list-item"}>
            <button onClick={() => setActiveTab("news")}>
              Новости
            </button>
          </li>
          <li className={activeTab === "myTrainings" ? "active" : "Dashboard-nav-list-item"}>
            <button onClick={() => setActiveTab("myTrainings")}>
              Мои тренировки
            </button>
          </li>
          <li className={activeTab === "allTrainings" ? "active" : ""}>
            <button onClick={() => setActiveTab("allTrainings")}>
              Все тренировки
            </button>
          </li>
          <li className={activeTab === "coaches" ? "active" : ""}>
            <button onClick={() => setActiveTab("coaches")}>Тренеры</button>
          </li>
          <li className={activeTab === "myProfile" ? "active" : ""}>
            <button onClick={() => setActiveTab("myProfile")}>
              Мой профиль
            </button>
          </li>
        </ul>
      </nav>
      <div className="Dashboard-content">
        {activeTab === "news" && <News token={token} />}
        {activeTab === "myTrainings" && <MyTrainings token={token} />}
        {activeTab === "allTrainings" && <AllTrainings token={token} />}
        {activeTab === "coaches" && <Coaches token={token} />}
        {activeTab === "myProfile" && <MyProfile token={token} />}
      </div>
    </div>
  );
}

export default Dashboard;
