import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import '../App.css';

const API_BASE_URL = 'http://localhost:8000';


function MyProfile({ token }) {
    // const [resident, setResident] = useState([]);
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleProfileChanges = async (e) => {
        e.preventDefault();
        try {
            const getResidentIdResponse = await axios.get(`${API_BASE_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            let residentId = getResidentIdResponse.data.id;

            const changeProfileDataResponse = await axios.put(`${API_BASE_URL}/residents/${residentId}`, {
                surname,
                name,
                birthdate,
                email,
                phone,
            });
            alert('Данные успешно обновлены!');

        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Check the console for details.');
        }
    };
    useEffect(() => {
        const fetchResident = async () => {
            try {
                const getResidentIdResponse = await axios.get(`${API_BASE_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let residentId = getResidentIdResponse.data.id;

                const getResidentInfoResponse = await axios.get(`${API_BASE_URL}/residents/${residentId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // setResident(getResidentInfoResponse.data);
                setSurname(getResidentInfoResponse.data.surname);
                setName(getResidentInfoResponse.data.name);
                setBirthdate(getResidentInfoResponse.data.birthdate);
                setEmail(getResidentInfoResponse.data.email);
                setPhone(getResidentInfoResponse.data.phone);

            } catch (error) {
                console.error('Error fetching resident info:', error);
                alert('Failed to fetch resident info. Check the console for details.');
            }
        };

        fetchResident();
    }, [token]);

    return (
        <div>
            <h2>Мой профиль</h2>
            <div className="Auth-form-container">
                <form className="Auth-form" onSubmit={handleProfileChanges}>
                <div className="Auth-form-content">
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
                            Применить
                        </button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    );
}

export default MyProfile;