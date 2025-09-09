import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import '../App.css';

const API_BASE_URL = 'http://localhost:8000';

function Register({ setAuthToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username,
        password,
        surname,
        name,
        birthdate,
        email,
        phone,
      });
      setAuthToken(response.data.access_token);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Check the console for details.');
    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Регистрация</h3>
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
            <label>Дата рождения</label>
            <input
              type="datetime-local"
              className="form-control mt-1"
              placeholder="Введите дату рождения"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Почта</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Введите email почту"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Телефон</label>
            <input
              type="tel"
              className="form-control mt-1"
              placeholder="Введите номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Зарегистрироваться
            </button>
          </div>
          <p className="text-center mt-2">
            Уже зарегистрированы? <Link to="/login">Вход</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
