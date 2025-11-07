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

import MyTrainings from "./training_session/MyTrainings";
import AllTrainings from "./training_session/AllTrainings";

import MyAchievements from "./achievement/MyAchievements";
import AllAchievements from "./achievement/AllAchievements";

import MySubscription from "./subscription/MySubscription";
import ExtendSubscription from "./subscription/ExtendSubscription";

import Coaches from "./Coaches";
import MyProfile from "./MyProfile";
import UserGuide from "./UserGuide";

function Dashboard({ token }) {
  const [activeTab, setActiveTab] = useState("news");

  const [isTrainingsDropdownOpen, setIsTrainingsDropdownOpen] = useState(false);
  const [isAchievementsDropdownOpen, setIsAchievementDropdownOpen] =
    useState(false);
  const [isSubscriptionDropdownOpen, setIsSubscriptionDropdownOpen] =
    useState(false);

  const toggleTrainingsDropdown = () => {
    setIsTrainingsDropdownOpen(true);
  };
  const toggleAchievementsDropdown = () => {
    setIsAchievementDropdownOpen(true);
  };
  const toggleSubscriptionDropdown = () => {
    setIsSubscriptionDropdownOpen(true);
  };

  const closeTrainingsDropdown = () => {
    setIsTrainingsDropdownOpen(false);
  };
  const closeAchievementsDropdown = () => {
    setIsAchievementDropdownOpen(false);
  };
  const closeSubscriptionDropdown = () => {
    setIsSubscriptionDropdownOpen(false);
  };

  return (
    <div className="Dashboard">
      <nav className="Dashboard-nav">
        <ul className="Dashboard-nav-list">
          <li
            className={
              activeTab === "news" ? "active" : "Dashboard-nav-list-item"
            }
          >
            <button onClick={() => setActiveTab("news")}>Новости</button>
          </li>

          <li
            className={activeTab === "trainings" ? "active" : ""}
            onMouseEnter={toggleTrainingsDropdown}
            onMouseLeave={closeTrainingsDropdown}
          >
            <button>Учёт тренировок</button>
            {isTrainingsDropdownOpen && (
              <ul className="dropdown-menu">
                <li className={activeTab === "myTrainings" ? "active" : ""}>
                  <button onClick={() => setActiveTab("myTrainings")}>
                    Мои тренировки
                  </button>
                </li>
                <li className={activeTab === "allTrainings" ? "active" : ""}>
                  <button onClick={() => setActiveTab("allTrainings")}>
                    Все тренировки
                  </button>
                </li>
              </ul>
            )}
          </li>

          <li
            className={activeTab === "achievements" ? "active" : ""}
            onMouseEnter={toggleAchievementsDropdown}
            onMouseLeave={closeAchievementsDropdown}
          >
            <button>Учёт достижений</button>
            {isAchievementsDropdownOpen && (
              <ul className="dropdown-menu">
                <li className={activeTab === "myAchievements" ? "active" : ""}>
                  <button onClick={() => setActiveTab("myAchievements")}>
                    Мои достижения
                  </button>
                </li>
                <li className={activeTab === "allAchievements" ? "active" : ""}>
                  <button onClick={() => setActiveTab("allAchievements")}>
                    Все достижения
                  </button>
                </li>
              </ul>
            )}
          </li>

          <li
            className={activeTab === "subscription" ? "active" : ""}
            onMouseEnter={toggleSubscriptionDropdown}
            onMouseLeave={closeSubscriptionDropdown}
          >
            <button>Учёт абонемента</button>
            {isSubscriptionDropdownOpen && (
              <ul className="dropdown-menu">
                <li className={activeTab === "mySubscription" ? "active" : ""}>
                  <button onClick={() => setActiveTab("mySubscription")}>
                    Просмотр абонемента
                  </button>
                </li>
                <li className={activeTab === "extendSubscription" ? "active" : ""}>
                  <button onClick={() => setActiveTab("extendSubscription")}>
                    Продление абонемента
                  </button>
                </li>
              </ul>
            )}
          </li>

          
          <li className={activeTab === "coaches" ? "active" : ""}>
            <button onClick={() => setActiveTab("coaches")}>Просмотр тренеров</button>
          </li>
          <li className={activeTab === "myProfile" ? "active" : ""}>
            <button onClick={() => setActiveTab("myProfile")}>
              Мой профиль
            </button>
          </li>
          <li className={activeTab === "userGuide" ? "active" : ""}>
            <button onClick={() => setActiveTab("userGuide")}>?</button>
          </li>
        </ul>
      </nav>
      <div className="Dashboard-content">
        {activeTab === "news" && <News token={token} />}
        {activeTab === "myTrainings" && <MyTrainings token={token} />}
        {activeTab === "allTrainings" && <AllTrainings token={token} />}
        {activeTab === "myAchievements" && <MyAchievements token={token} />}
        {activeTab === "allAchievements" && <AllAchievements token={token} />}
        {activeTab === "mySubscription" && <MySubscription token={token} />}
        {activeTab === "extendSubscription" && <ExtendSubscription token={token} />}
        {activeTab === "coaches" && <Coaches token={token} />}
        {activeTab === "myProfile" && <MyProfile token={token} />}
        {activeTab === "userGuide" && <UserGuide />}
      </div>
    </div>
  );
}

export default Dashboard;
