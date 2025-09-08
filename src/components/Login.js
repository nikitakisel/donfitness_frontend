import API_BASE_URL from '../App.js';

// components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';

function Login({ setAuthToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [shouldNavigate, setShouldNavigate] = useState(false);  // New state

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
            });

            console.log("Full Response:", response);

            if (response.data && response.data.access_token) {
                setAuthToken(response.data.access_token);
                console.log("Login successful! Token:", response.data.access_token);
                setShouldNavigate(true);  // Set navigation state
            } else {
                console.error("Login failed: access_token missing from response");
                alert("Login failed: access_token missing from response. Check console.");
            }

        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Check the console for details.');
        }
    };

    //Conditionally redirect
    if (shouldNavigate) {
        return <Navigate to="/" />;
    }

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

export default Login;
