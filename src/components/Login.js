import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import '../App.css';

const API_BASE_URL = 'http://localhost:8000';

function Login({ setAuthToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      const tokenResponse = await axios.post(`${API_BASE_URL}/token`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const userMeResponse = await axios.get(`${API_BASE_URL}/users/me`,
        {
          headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
        }
      );
      
      setAuthToken(tokenResponse.data.access_token, userMeResponse.data.username);
      navigate("/");
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Check the console for details.');
    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Вход</h3>
          <div className="form-group mt-3">
            <label>Имя пользователя</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="Введите имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Пароль</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Войти
            </button>
          </div>
          <p className="text-center mt-2">
            Ещё не зарегистрированы? <Link to="/register">Регистрация</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
