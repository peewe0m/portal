// src/components/Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import Home from '../components/home';
import Employee from '../components/employee';
// Create and import DTR component if it exists
import DTR from '../components/dtr'; // Make sure this file/component exists

const Dashboard = () => {
  const [activePanel, setActivePanel] = useState('Home');
  const navigate = useNavigate();

  // ✅ Added "DTR" to the buttons array
  const buttons = ['Home', 'Employee', 'DTR', 'Biometrics', 'System Logs', 'Settings', 'Logout'];

  const handleButtonClick = (btn) => {
    if (btn === 'Logout') {
      navigate('/home'); // or logout logic
    } else {
      setActivePanel(btn);
    }
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'Home':
        return <Home />;
      case 'Employee':
        return <Employee />;
      case 'DTR':
        return <DTR />; // ✅ Rende
      case 'Biometrics':
        return <div className="main-panel">System Logs Panel</div>;
      case 'Settings':
        return <div className="main-panel">Settings Panel</div>;
      default:
        return <div className="main-panel">Select a panel</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`sidebar-button ${activePanel === btn ? 'active' : ''}`}
            >
              {btn}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">© 2025 Powerhouse</div>
      </aside>

      <main className="main-content">
        {renderPanel()}
      </main>
    </div>
  );
};

export default Dashboard;
