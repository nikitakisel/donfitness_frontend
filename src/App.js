
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const setAuthToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    setAuthToken(null);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>DonFitness</h1>
          {token ? (
            <div>
              <button onClick={handleLogout}>Выход</button>
            </div>
          ) : null}
        </header>
        <Routes>
          <Route path="/register" element={<Register setAuthToken={setAuthToken} />} />
          <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
          <Route
            path="/"
            element={
              token ? (
                <Dashboard token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;