
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import AllTrainings from './AllTrainings'; // Assuming you'll move the components to separate files
import Coaches from './Coaches';
import MyTrainings from './MyTrainings';

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
              <button onClick={handleLogout}>Logout</button>
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
          <h3 className="Auth-form-title">Register</h3>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group mt-3">
            <label>Surname</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="Enter surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Birthdate</label>
            <input
              type="datetime-local"
              className="form-control mt-1"
              placeholder="Enter birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Phone</label>
            <input
              type="tel"
              className="form-control mt-1"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="text-center mt-2">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

function Login({ setAuthToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      const response = await axios.post(`${API_BASE_URL}/token`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        // withCredentials: true, // !!!!!!!!!!!!!!!!!!!!!!
      });
      setAuthToken(response.data.access_token);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Check the console for details.');
    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="text-center mt-2">
            Not registered yet? <Link to="/register">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

function Dashboard({ token }) {
  const [activeTab, setActiveTab] = useState('myTrainings');

  return (
    <div className="Dashboard">
      <nav className="Dashboard-nav">
        <ul>
          <li className={activeTab === 'myTrainings' ? 'active' : ''}>
            <button onClick={() => setActiveTab('myTrainings')}>My Trainings</button>
          </li>
          <li className={activeTab === 'allTrainings' ? 'active' : ''}>
            <button onClick={() => setActiveTab('allTrainings')}>All Trainings</button>
          </li>
          <li className={activeTab === 'coaches' ? 'active' : ''}>
            <button onClick={() => setActiveTab('coaches')}>Coaches</button>
          </li>
        </ul>
      </nav>
      <div className="Dashboard-content">
        {activeTab === 'myTrainings' && <MyTrainings token={token} />}
        {activeTab === 'allTrainings' && <AllTrainings token={token} />}
        {activeTab === 'coaches' && <Coaches token={token} />}
      </div>
    </div>
  );
}

export default App;
