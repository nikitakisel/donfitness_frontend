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

function MySubscription({ token }) {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = () => {
      setSubscriptions([
        [1, "DONFIT POLITICS", "Этот абонемент бесплатный", "07.11.2026"],
        [1, "DONFIT BLACK", "Открывает все возможности тренировок", "08.11.2026"]
      ]);
    };

    fetchSubscriptions();
  }, [token]);
  return (
    <div>
      <h2 className="Chapter-title">Мои абонементы</h2>
      {subscriptions.length > 0 ? (
        <div className="Coach-wrapper">
          <div className="Coach-list">
            {subscriptions.map((subscription) => (
              <div key={subscription[0]} className="Coach-item">
                <div className="Coach-image Subscription-img"></div>
                <div className="Coach-info">
                  <h3>{subscription[1]}</h3>
                  <p>{subscription[2]}</p>
                  <p>Дата окончания действия: {subscription[3]}</p>
                </div>
                <div></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Нет активных абонементов.</p>
      )}
    </div>
  );
}

export default MySubscription;
