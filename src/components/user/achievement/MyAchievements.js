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

function MyAchievements({ token }) {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/achievements/received`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAchievements(response.data);
      } catch (error) {
        console.error("Error fetching received achievements:", error);
        alert(
          "Failed to fetch received achievements. Check the console for details."
        );
      }
    };

    fetchAchievements();
  }, [token]);

  return (
    <div>
      <h2 className="Chapter-title">Полученные достижения</h2>
      {achievements.length > 0 ? (
        <div className="Coach-wrapper">
          <div className="Coach-list">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="Coach-item">
                <div className="Coach-image Achievement-img"></div>
                <div className="Coach-info">
                  <h3>{achievement.achievement_name}</h3>
                  <p>{achievement.description}</p>
                  <p>Критерии: {achievement.criteria}</p>
                </div>
                <div></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Нет доступных полученных достижений.</p>
      )}
    </div>
  );
}

export default MyAchievements;
