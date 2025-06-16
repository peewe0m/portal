// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import './home.css';
import { FaUser, FaUserTimes, FaClock, FaCheckCircle, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const Home = () => {
  const [stats, setStats] = useState({
    employees: 0,
    absent: 0,
    late: 0,
    present: 0,
    totalUsers: 0,
    workingDays: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: 'Employees', value: stats.employees, icon: <FaUsers /> },
    { title: 'Absent', value: stats.absent, icon: <FaUserTimes /> },
    { title: 'Late', value: stats.late, icon: <FaClock /> },
    { title: 'Present', value: stats.present, icon: <FaCheckCircle /> },
    { title: 'Users', value: stats.totalUsers, icon: <FaUser /> },
    { title: 'Working Days', value: stats.workingDays, icon: <FaCalendarAlt /> },
  ];

  return (
    <div className="home-dashboard">
      {cards.map((card, index) => (
        <div key={index} className="dashboard-card">
          <div className="icon">{card.icon}</div>
          <div className="info">
            <h3>{card.title}</h3>
            <p>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
