import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';


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

export default Dashboard;
