import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

import Home from '../components/home';
import Employee from '../components/employee';
import DTR from '../components/dtr';
import LeaveApproval from '../components/leave'; // Leave Approval Component

const Dashboard = () => {
  const [activePanel, setActivePanel] = useState('Home');
  const navigate = useNavigate();

  const buttons = [
    'Home',
    'Employee',
    'Daily Tracking Record',
    'Leave Approval',
    'Biometrics',
    'System Logs',
    'Settings',
    'Logout'
  ];

  const handleButtonClick = (btn) => {
    if (btn === 'Logout') {
      sessionStorage.clear(); // Optional: clear session on logout
      navigate('/home');
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
      case 'Daily Tracking Record':
        return <DTR />;
      case 'Leave Approval':
        return <LeaveApproval />;
      case 'Biometrics':
        return <div className="main-panel">Biometrics Panel (Coming Soon)</div>;
      case 'System Logs':
        return <div className="main-panel">System Logs Panel (Coming Soon)</div>;
      case 'Settings':
        return <div className="main-panel">Settings Panel (Coming Soon)</div>;
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
        <div key={activePanel} className="fade-in">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
